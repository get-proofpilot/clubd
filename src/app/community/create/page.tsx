'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Camera, Loader2, Globe, Instagram,
  Building2, Users, Sparkles, Store,
} from 'lucide-react';
import { trpcReact } from '@/lib/trpc';
import { authClient } from '@/lib/auth-client';
import { getCategoryLabel } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import ImageUpload from '@/components/ImageUpload';
import PlacesAutocomplete, { type PlaceResult } from '@/components/PlacesAutocomplete';

const COMMUNITY_TYPES = [
  { value: 'community', label: 'Community', icon: Users, description: 'A group or club' },
  { value: 'studio', label: 'Studio', icon: Sparkles, description: 'Fitness or wellness studio' },
  { value: 'brand', label: 'Brand', icon: Store, description: 'Company or product' },
  { value: 'organization', label: 'Organization', icon: Building2, description: 'Nonprofit or group' },
] as const;

type CommunityType = (typeof COMMUNITY_TYPES)[number]['value'];

const CATEGORIES = [
  'fitness', 'wellness', 'social', 'outdoor',
  'food_drink', 'creative', 'family', 'community',
] as const;

type CategoryValue = (typeof CATEGORIES)[number];

interface UploadedImage {
  url: string;
  key: string;
}

export default function CreateCommunityPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [name, setName] = useState('');
  const [type, setType] = useState<CommunityType | ''>('');
  const [category, setCategory] = useState<CategoryValue | ''>('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [locationData, setLocationData] = useState<PlaceResult | null>(null);
  const [instagramHandle, setInstagramHandle] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Cover image
  const [coverImages, setCoverImages] = useState<UploadedImage[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { startUpload: uploadAvatar } = useUploadThing('communityImage', {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        setAvatarUrl(res[0].ufsUrl);
      }
      setIsUploadingAvatar(false);
    },
    onUploadError: () => {
      setIsUploadingAvatar(false);
    },
  });

  const createCommunity = trpcReact.community.create.useMutation({
    onSuccess: (data) => {
      router.push(`/community/${data.slug}`);
    },
  });

  if (!sessionLoading && !session?.user) {
    router.push('/login');
    return null;
  }

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    if (!type) {
      newErrors.type = 'Please select a type';
    }
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    createCommunity.mutate({
      name: name.trim(),
      type: type as CommunityType,
      category: category as CategoryValue,
      description: description.trim() || undefined,
      avatarUrl: avatarUrl ?? undefined,
      coverImageUrl: coverImages[0]?.url ?? undefined,
      locationLabel: (locationData?.name ?? locationText.trim()) || undefined,
      locationLat: locationData?.lat ?? undefined,
      locationLng: locationData?.lng ?? undefined,
      instagramHandle: instagramHandle.trim().replace(/^@/, '') || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
    });
  }

  async function handleAvatarUpload(files: FileList) {
    if (!files[0]) return;
    setIsUploadingAvatar(true);
    await uploadAvatar([files[0]]);
  }

  const inputClasses =
    'h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10';

  const isLoading = createCommunity.isPending;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-[var(--color-border-subtle)]">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 pb-3 pt-[max(env(safe-area-inset-top),14px)] sm:px-8">
          <Link href="/host/dashboard" className="tap-target flex items-center justify-center rounded-full">
            <ArrowLeft className="h-5 w-5 text-[var(--color-text-primary)]" strokeWidth={1.8} />
          </Link>
          <h1 className="font-display text-lg font-bold text-[var(--color-text-primary)]">Create Community</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 pt-6 sm:px-8">
        {/* Error banner */}
        {createCommunity.error && (
          <div className="mb-4 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {createCommunity.error.message}
          </div>
        )}

        {/* Avatar + Cover layout */}
        <div className="relative mb-8">
          {/* Cover Image */}
          <ImageUpload
            images={coverImages}
            onChange={setCoverImages}
            maxImages={1}
            variant="cover"
          />

          {/* Avatar — overlaps the cover */}
          <div className="absolute -bottom-10 left-6">
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--color-bg)] bg-[var(--color-surface-subtle)] shadow-md transition-colors hover:bg-[var(--color-border)]"
            >
              {avatarUrl ? (
                <>
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera size={18} className="text-white" />
                  </div>
                </>
              ) : isUploadingAvatar ? (
                <Loader2 size={24} className="animate-spin text-[var(--color-text-muted)]" />
              ) : (
                <Camera size={24} className="text-[var(--color-text-muted)]" />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleAvatarUpload(e.target.files)}
            />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
              Community Name
            </label>
            <input
              type="text"
              placeholder="e.g., OC Run Collective"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="mb-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {COMMUNITY_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-[var(--radius-md)] border-2 p-3 text-center transition-all ${
                      type === t.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]'
                        : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-border-strong)]'
                    }`}
                  >
                    <Icon
                      size={20}
                      className={type === t.value ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}
                    />
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">{t.label}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">{t.description}</span>
                  </button>
                );
              })}
            </div>
            {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
              Primary Activity
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
              Description
              <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">(optional)</span>
            </label>
            <textarea
              placeholder="Tell people what your community is about..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-1.5 text-sm font-semibold text-[var(--color-text-primary)]">
              Location
              <span className="ml-1 text-xs font-normal text-[var(--color-text-muted)]">(optional)</span>
            </label>
            <PlacesAutocomplete
              value={locationText}
              onChange={setLocationText}
              onSelect={(place) => setLocationData(place)}
              placeholder="Where are you based?"
            />
            {locationData && (
              <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{locationData.address}</p>
            )}
          </div>

          {/* Social links */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
                <Instagram size={14} className="text-[var(--color-text-muted)]" />
                Instagram
              </label>
              <input
                type="text"
                placeholder="@yourhandle"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
                <Globe size={14} className="text-[var(--color-text-muted)]" />
                Website
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg)]/95 backdrop-blur-md pb-[max(env(safe-area-inset-bottom),12px)]">
        <div className="mx-auto flex max-w-2xl px-5 pt-3 sm:px-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-press flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] font-bold text-white disabled:opacity-60"
            style={{ boxShadow: 'var(--shadow-button)' }}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating...' : 'Create Community'}
          </button>
        </div>
      </div>
    </div>
  );
}
