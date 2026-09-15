import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Check, 
  Swords, 
  Building, 
  GraduationCap, 
  UserPlus, 
  DollarSign, 
  Sparkles 
} from 'lucide-react';
import { MarketplaceListing, SportId } from '../types/sport';
import { SPORT_CONFIGS } from '../engine/strategyRegistry';

interface LookingForMarketplaceProps {
  listings: MarketplaceListing[];
  onAddListing: (listing: MarketplaceListing) => void;
}

export const LookingForMarketplace: React.FC<LookingForMarketplaceProps> = ({
  listings,
  onAddListing
}) => {
  const [activeType, setActiveType] = useState<string>('ALL');
  const [activeSport, setActiveSport] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [challengeSuccessModal, setChallengeSuccessModal] = useState<MarketplaceListing | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New listing state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'OPPONENT' | 'TEAM' | 'COACH' | 'VENUE'>('OPPONENT');
  const [newSport, setNewSport] = useState<SportId>('cricket');
  const [newLocation, setNewLocation] = useState('');
  const [newFee, setNewFee] = useState('₹500 / team (Split)');
  const [newDescription, setNewDescription] = useState('');

  const filtered = listings.filter((item) => {
    if (activeType !== 'ALL' && item.type !== activeType) return false;
    if (activeSport !== 'ALL' && item.sport !== activeSport) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.organizer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendChallenge = (listing: MarketplaceListing) => {
    setChallengeSuccessModal(listing);
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation) return;

    const newEntry: MarketplaceListing = {
      id: 'mkt_' + Date.now(),
      type: newType,
      sport: newSport,
      title: newTitle,
      organizer: 'Verified Athlete Member',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      location: newLocation,
      dateOrAvailability: 'Upcoming Weekend',
      skillLevel: 'Intermediate',
      costOrFee: newFee,
      description: newDescription || 'Grassroots fixture looking for verified players on SportPulse.'
    };

    onAddListing(newEntry);
    setShowCreateModal(false);
    setNewTitle('');
    setNewLocation('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                "Looking For" Grassroots Marketplace
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 font-mono-code">
                Community Player & Turf Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
              Find Opponents, Teams, Coaches & Grounds
            </h2>
            <p className="text-xs text-slate-400">
              Never miss a match. Connect with verified opponents, book smart sports turfs, and recruit players across all sports.
            </p>
          </div>

          <button
            id="btn-post-listing"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-center shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Post "Looking For" Listing</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Types */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All Categories', icon: null },
            { id: 'OPPONENT', label: 'Opponents', icon: Swords },
            { id: 'TEAM', label: 'Teams / Tryouts', icon: Users },
            { id: 'COACH', label: 'Coaches', icon: GraduationCap },
            { id: 'VENUE', label: 'Grounds & Courts', icon: Building }
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                id={`mkt-cat-${cat.id}`}
                onClick={() => setActiveType(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeType === cat.id
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Sport Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opponent or turf..."
              className="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 sm:w-56"
            />
          </div>

          <select
            value={activeSport}
            onChange={(e) => setActiveSport(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 font-medium focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Sports</option>
            <option value="football">Football ⚽</option>
            <option value="tennis">Tennis 🎾</option>
            <option value="mma">MMA 🥋</option>
            <option value="basketball">Basketball 🏀</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-3.5 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Sport Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider ${
                    item.type === 'OPPONENT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    item.type === 'TEAM' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                    item.type === 'COACH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-xs font-mono-code text-slate-400">
                    {SPORT_CONFIGS[item.sport]?.icon} {SPORT_CONFIGS[item.sport]?.name}
                  </span>
                </div>
                <span className="text-xs font-mono-code font-bold text-emerald-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                  {item.costOrFee}
                </span>
              </div>

              {/* Title & Organizer */}
              <h3 className="font-display font-bold text-base text-white">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Organized by <strong className="text-slate-200">{item.organizer}</strong>
              </p>

              {/* Meta details */}
              <div className="grid grid-cols-2 gap-2 my-3 text-xs text-slate-300 font-mono-code bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{item.dateOrAvailability}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono-code text-slate-500">
                Skill Level: <span className="text-slate-300 font-semibold">{item.skillLevel}</span>
              </span>

              <button
                id={`btn-challenge-${item.id}`}
                onClick={() => handleSendChallenge(item)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                {item.type === 'OPPONENT' && <span>Send Challenge ⚔️</span>}
                {item.type === 'TEAM' && <span>Request Tryout 📋</span>}
                {item.type === 'COACH' && <span>Book Session 📅</span>}
                {item.type === 'VENUE' && <span>Reserve Court 🏟️</span>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {challengeSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-display font-bold text-white">
                Request Dispatched!
              </h3>
              <p className="text-xs text-slate-300">
                Your request has been routed to <strong>{challengeSuccessModal.organizer}</strong> for <strong>{challengeSuccessModal.title}</strong>.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono-code text-slate-400 space-y-1">
              <div>Fixture: {challengeSuccessModal.title}</div>
              <div>Location: {challengeSuccessModal.location}</div>
              <div className="text-emerald-400 font-bold">Status: Awaiting Host Confirmation</div>
            </div>

            <button
              onClick={() => setChallengeSuccessModal(null)}
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Create "Looking For" Opportunity</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Listing Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="OPPONENT">Looking for Opponent (Friendly Match)</option>
                  <option value="TEAM">Looking for Team / Tryout Recruitment</option>
                  <option value="COACH">Looking for Coach / Clinic</option>
                  <option value="VENUE">Offering Ground / Court Slot</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Sport</label>
                <select
                  value={newSport}
                  onChange={(e) => setNewSport(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="football">Football ⚽</option>
                  <option value="tennis">Tennis 🎾</option>
                  <option value="mma">MMA 🥋</option>
                  <option value="basketball">Basketball 🏀</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 7v7 Friendly Match Wanted this Thursday"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Location / Venue</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Hackney Marshes Pitch 4 • London"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Cost / Fee Split</label>
                <input
                  type="text"
                  value={newFee}
                  onChange={(e) => setNewFee(e.target.value)}
                  placeholder="e.g. Split pitch fee (£30/team) or Free"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Details on skill level, referees, ball provided, rules..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
