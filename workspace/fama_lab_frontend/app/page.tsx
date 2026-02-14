'use client';

import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import StatsCounter from '@/components/StatsCounter';
import ArtistCard from '@/components/ArtistCard';
import { Music, Users, Trophy, Zap, Crown, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { Artist } from '@/types';

const features = [
  {
    icon: <Music className="w-6 h-6" />,
    title: 'Direct Artist Connection',
    description: 'Connect directly with your favorite artists through exclusive content and interactions.',
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Earn Rewards',
    description: 'Earn points for streaming, engaging, and participating in community activities.',
  },
  {
    icon: <Crown className="w-6 h-6" />,
    title: 'VIP Access',
    description: 'Unlock exclusive perks, early access to releases, and special experiences.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Fan Community',
    description: 'Join a vibrant community of music lovers and share your passion.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Instant Streaming',
    description: 'Stream high-quality music and video content with zero latency.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Artist Support',
    description: 'Directly support artists through streams, purchases, and tips.',
  },
];

const pricingPlans = [
  {
    name: 'Fan',
    price: 'Free',
    features: [
      'Access to all artists',
      'Basic streaming quality',
      'Community access',
      '5 points per stream',
    ],
    popular: false,
  },
  {
    name: 'Super Fan',
    price: '$9.99/mo',
    features: [
      'Everything in Fan',
      'HD streaming quality',
      'Exclusive content',
      'Early access to releases',
      '15 points per stream',
      'Monthly rewards',
    ],
    popular: true,
  },
  {
    name: 'VIP',
    price: '$19.99/mo',
    features: [
      'Everything in Super Fan',
      'Lossless audio quality',
      'Meet & greet opportunities',
      'Artist DM access',
      '25 points per stream',
      'Exclusive merchandise',
      'Priority support',
    ],
    popular: false,
  },
];

export default function HomePage() {
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await api.get('/artists/featured');
        setFeaturedArtists(response.data);
      } catch (error) {
        // Use mock data for demo
        setFeaturedArtists([
          {
            id: '1',
            slug: 'aria-storm',
            name: 'Aria Storm',
            bio: 'Electronic music producer known for immersive soundscapes.',
            avatar: 'https://picsum.photos/200',
            banner: 'https://picsum.photos/800/400',
            genre: 'Electronic',
            location: 'Los Angeles',
            followers: 125000,
            tracks: 45,
            videos: 12,
            isPromoted: true,
          },
          {
            id: '2',
            slug: 'jazz-minter',
            name: 'Jazz Minter',
            bio: 'Soulful jazz artist blending tradition with modern influences.',
            avatar: 'https://picsum.photos/201',
            banner: 'https://picsum.photos/801/400',
            genre: 'Jazz',
            location: 'New York',
            followers: 89000,
            tracks: 32,
            videos: 8,
            isPromoted: true,
          },
          {
            id: '3',
            slug: 'neon-pulse',
            name: 'Neon Pulse',
            bio: 'Synthwave duo bringing retro vibes to the modern era.',
            avatar: 'https://picsum.photos/202',
            banner: 'https://picsum.photos/802/400',
            genre: 'Synthwave',
            location: 'Berlin',
            followers: 210000,
            tracks: 28,
            videos: 15,
            isPromoted: true,
          },
        ]);
      }
    };
    fetchArtists();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-20 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Why Choose FAMA.LAB?</h2>
          <p className="section-subtitle mb-12">
            Experience music like never before with our innovative platform designed for true music enthusiasts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCounter value={50000} label="Active Fans" />
            <StatsCounter value={500} label="Artists" />
            <StatsCounter value={1000000} label="Monthly Streams" />
            <StatsCounter value={2000000} prefix="$" label="Rewards Paid" suffix="+" />
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-dark-50">
                Featured Artists
              </h2>
              <p className="text-dark-400 mt-2">
                Discover the hottest talents on our platform
              </p>
            </div>
            <Link href="/artists" className="btn-secondary">
              View All Artists
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArtists.map((artist, index) => (
              <ArtistCard key={artist.id} artist={artist} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Choose Your Plan</h2>
          <p className="section-subtitle mb-12">
            Unlock premium features and maximize your music experience
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`card relative ${
                  plan.popular ? 'border-gold-500 gold-glow' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 
                                bg-gold-500 text-dark-950 text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-dark-50 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold gradient-text">{plan.price}</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-dark-300">
                      <div className="w-5 h-5 rounded-full bg-gold-500/20 flex items-center justify-center mr-3">
                        <div className="w-2 h-2 rounded-full bg-gold-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full ${
                    plan.popular ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-dark-50 mb-4">
            Ready to <span className="gradient-text">Elevate</span> Your Music Experience?
          </h2>
          <p className="text-dark-400 mb-8 max-w-2xl mx-auto">
            Join thousands of music enthusiasts who are already enjoying exclusive content, 
            earning rewards, and connecting with their favorite artists.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary">
              Create Free Account
            </Link>
            <Link href="/artists" className="btn-secondary">
              Explore Artists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
