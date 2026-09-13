import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Ticket, 
  Award, 
  BarChart3, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  ExternalLink,
  Crown,
  Layers
} from 'lucide-react';
import { AthleteProfile, SportId } from '../types/sport';
import { SPORT_CONFIGS } from '../engine/strategyRegistry';

interface MonetizationHubProps {
  athletes: AthleteProfile[];
  selectedSport: SportId;
}

export const MonetizationHub: React.FC<MonetizationHubProps> = ({
  athletes,
  selectedSport
}) => {
  const [activeTab, setActiveTab] = useState<'scout_analytics' | 'd2c_ecommerce' | 'ppv_passes' | 'brand_sponsors'>('scout_analytics');
  const [unlockedPass, setUnlockedPass] = useState(false);
  const [orderedItem, setOrderedItem] = useState<string | null>(null);

  // D2C Gear Catalog mapped by sport
  const gearCatalog = [
    {
      id: 'gear_cricket_1',
      sport: 'cricket',
      title: 'SG Sunny Tonny Classic English Willow Cricket Bat',
      brand: 'SG Cricket India',
      price: '₹8,999',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1531415074868-8363301746b8?w=200&auto=format&fit=crop&q=80',
      tag: 'Grade 1 Willow • Sixer Punch'
    },
    {
      id: 'gear_cricket_2',
      sport: 'cricket',
      title: 'SS Kashmir Willow Player Full Kit with Pads & Helmet',
      brand: 'SS Sareen Sports',
      price: '₹4,499',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1589803791278-8395561a0989?w=200&auto=format&fit=crop&q=80',
      tag: 'Tournament Tested'
    },
    {
      id: 'gear_kabaddi_1',
      sport: 'kabaddi',
      title: 'Shiv-Naresh Mat Pro Raider Traction Shoes',
      brand: 'Shiv-Naresh India',
      price: '₹2,199',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80',
      tag: 'Anti-Slip Gum Sole'
    },
    {
      id: 'gear_badminton_1',
      sport: 'badminton',
      title: 'Yonex Astrox Smash Lightweight Carbon Racket',
      brand: 'Yonex Sunrise India',
      price: '₹3,299',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=200&auto=format&fit=crop&q=80',
      tag: 'Rotational Generator'
    },
    {
      id: 'gear_football_1',
      sport: 'football',
      title: 'Nivia Storm High-Durability Match Football',
      brand: 'Nivia Sports India',
      price: '₹1,199',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=200&auto=format&fit=crop&q=80',
      tag: 'FIFA Grassroots Certified'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                Diversified Monetization Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 font-mono-code">
                Beyond Standard Subscriptions
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
              Data Analytics, D2C Gear, PPV & League Sponsorships
            </h2>
            <p className="text-xs text-slate-400">
              Transforming local grassroots sports into a sustainable multi-million dollar economic ecosystem.
            </p>
          </div>

          <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] font-mono-code text-slate-400 block uppercase">Projected Annual GMV</span>
            <span className="text-base font-display font-extrabold text-emerald-400">₹38.5 Cr Ecosystem GMV</span>
          </div>
        </div>
      </div>

      {/* 4 Monetization Stream Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {[
          { id: 'scout_analytics', label: '1. Data Analytics as a Service', icon: BarChart3, desc: 'Academy & Scout Portal' },
          { id: 'd2c_ecommerce', label: '2. D2C Gear Marketplace', icon: ShoppingBag, desc: 'Tailored Sport Equipment' },
          { id: 'ppv_passes', label: '3. Pay-Per-View (PPV)', icon: Ticket, desc: 'Grassroots Finals Pass' },
          { id: 'brand_sponsors', label: '4. Digital Naming Rights', icon: Crown, desc: 'Sponsorship Overlays' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="font-display font-bold text-xs text-white">{tab.label}</span>
              </div>
              <p className="text-[11px] text-slate-400">{tab.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Scout Data Analytics as a Service */}
      {activeTab === 'scout_analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <span>Grassroots Academy & Pro Scout Intelligence Portal</span>
              </h3>
              <p className="text-xs text-slate-400">
                Tier-1 IPL, ISL, and PKL scouts pay ₹15,000/mo to query raw match performance telemetry, radar metrics, and talent dossiers.
              </p>
            </div>
            <span className="text-xs font-mono-code text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 font-bold">
              B2B SaaS Revenue Stream
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-code text-slate-400">
              <span>Verified Prospects Ready for Academy Trials:</span>
              <span className="text-emerald-400 font-bold">{athletes.length} Athletes Ranked</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono-code">
                    <th className="py-2.5 px-3">Athlete</th>
                    <th className="py-2.5 px-3">Primary Sport</th>
                    <th className="py-2.5 px-3">Role / Position</th>
                    <th className="py-2.5 px-3">Win Rate</th>
                    <th className="py-2.5 px-3">Scout Index (OVR)</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {athletes.map((ath) => {
                    const avgMetric = Math.round(ath.radarMetrics.reduce((a, b) => a + b.value, 0) / ath.radarMetrics.length);
                    return (
                      <tr key={ath.id} className="hover:bg-slate-950/60 transition-colors">
                        <td className="py-3 px-3 flex items-center gap-2">
                          <img src={ath.avatar} alt={ath.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-bold text-white">{ath.name}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {SPORT_CONFIGS[ath.primarySport]?.name}
                        </td>
                        <td className="py-3 px-3 text-slate-400">{ath.role}</td>
                        <td className="py-3 px-3 font-mono-code text-emerald-400 font-bold">{ath.winRatePercent}%</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-emerald-500/30 font-mono-code font-bold text-emerald-400">
                            {avgMetric} / 100
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => alert(`Full Scouting Dossier generated for ${ath.name}. Telemetry data sent to scout clipboard.`)}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-bold transition-all"
                          >
                            Export Dossier
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: D2C Gear Marketplace */}
      {activeTab === 'd2c_ecommerce' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <span>Direct-to-Consumer (D2C) Sports Gear Marketplace</span>
              </h3>
              <p className="text-xs text-slate-400">
                Contextual hardware and apparel recommended based on the user's active sport and performance telemetry.
              </p>
            </div>
            <span className="text-xs font-mono-code text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 font-bold">
              15-20% Affiliate Take Rate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gearCatalog.map((gear) => (
              <div
                key={gear.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="h-32 rounded-xl overflow-hidden bg-slate-900 mb-3 relative">
                    <img src={gear.image} alt={gear.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono-code bg-black/70 text-emerald-400 font-bold">
                      {gear.tag}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider block">
                    {gear.brand}
                  </span>
                  <h4 className="font-display font-bold text-xs text-white mt-0.5 line-clamp-2">
                    {gear.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-mono-code font-bold text-sm text-emerald-400">
                    {gear.price}
                  </span>
                  <button
                    onClick={() => {
                      setOrderedItem(gear.title);
                      setTimeout(() => setOrderedItem(null), 3000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all"
                  >
                    {orderedItem === gear.title ? '✓ In Cart' : 'Buy Gear'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Pay-Per-View Grassroots Finals */}
      {activeTab === 'ppv_passes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-400" />
                <span>Pay-Per-View (PPV) Grassroots Match & Tournament Passes</span>
              </h3>
              <p className="text-xs text-slate-400">
                Local clubs and academies charge ₹49 for championship matches via instant UPI (GPay, PhonePe, Paytm). Revenue split 80% to organizer club, 20% to platform.
              </p>
            </div>
            <span className="text-xs font-mono-code text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 font-bold">
              80/20 Rev-Share • Instant UPI Settlement
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  LIVE PPV TICKET
                </span>
                <span className="text-base font-display font-extrabold text-emerald-400">₹49 Match Pass</span>
              </div>

              <div>
                <h4 className="text-base font-display font-bold text-white">
                  TATA Grassroots T20 Trophy • Quarter-Final Match Pass
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Mumbai Tigers CC vs Delhi Grassroots CC • Live 1080p60 stream from Shivaji Park with automated AI camera switching and ball-by-ball score overlays.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-code text-slate-300 space-y-1">
                <div>Projected Viewers: 3,800 ticket holders</div>
                <div>Gross Ticket Revenue: ₹1,86,200</div>
                <div className="text-emerald-400 font-bold">Host Academy Payout (80%): ₹1,48,960</div>
                <div className="text-slate-400">SportPulse Platform Fee (20%): ₹37,240</div>
              </div>

              <button
                onClick={() => setUnlockedPass(!unlockedPass)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  unlockedPass
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                }`}
              >
                {unlockedPass ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>PPV Pass Active • Live Stream Unlocked</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>Pay ₹49 via UPI (Google Pay / PhonePe / Paytm)</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-display font-bold text-white mb-2">
                  Why Grassroots PPV Works in India:
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Micro-transactions via UPI (₹49) have zero friction for relatives, fans, and local sports communities across India.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>No production van required: the volunteer scorer operates the scoring app and SportPulse automates broadcast-grade TV scorebugs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Directly funds pitch maintenance, umpire fees, leather balls, and floodlight electricity for local clubs.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono-code text-slate-400">
                Integrated with Razorpay UPI & India Grassroots Treasury escrows.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Brand Sponsorships & Digital Naming Rights */}
      {activeTab === 'brand_sponsors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-emerald-400" />
                <span>Brand Sponsorships & Digital Naming Rights</span>
              </h3>
              <p className="text-xs text-slate-400">
                Indian corporate giants sponsor local grassroots leagues with digital overlays, branded replay highlights, and turf watermarks.
              </p>
            </div>
            <span className="text-xs font-mono-code text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 font-bold">
              High-Margin Corporate B2B
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                partner: 'TATA Grassroots Sports',
                tier: 'T20 Trophy Title Partner',
                activation: 'Branded 30s Highlights & Boundary 4/6 Overlays',
                investment: '₹12,50,000 / Season',
                status: 'Active Live',
                badgeColor: 'border-blue-500/40 text-blue-400'
              },
              {
                partner: 'Dream11 Sports Lab',
                tier: 'Grassroots Talent Naming Rights',
                activation: 'Pro-Card Verified Badges & MVP Leaderboard',
                investment: '₹18,00,000 / Season',
                status: 'Active Live',
                badgeColor: 'border-emerald-500/40 text-emerald-400'
              },
              {
                partner: 'Amul India Hydration',
                tier: 'Grassroots Kabaddi & Cricket Partner',
                activation: 'Player of the Match Trophy & Milk Hydration Bug',
                investment: '₹8,50,000 / Season',
                status: 'Renewed for 2026',
                badgeColor: 'border-amber-500/40 text-amber-400'
              }
            ].map((sp) => (
              <div
                key={sp.partner}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono-code text-slate-400 font-bold">
                      {sp.tier}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-mono-code ${sp.badgeColor}`}>
                      {sp.status}
                    </span>
                  </div>
                  <h4 className="text-base font-display font-bold text-white">
                    {sp.partner}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {sp.activation}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-code">
                  <span className="text-slate-400">Contract Value:</span>
                  <span className="text-emerald-400 font-bold">{sp.investment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
