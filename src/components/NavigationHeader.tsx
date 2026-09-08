import React from 'react';
import { AppView, UserProfile } from '../types';

interface NavigationHeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  cartCount: number;
  partnerOrderCount: number;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentView,
  onSelectView,
  cartCount,
  partnerOrderCount,
  currentUser,
  onLogout,
}) => {
  return (
    <div className="bg-[#131b2e] text-white border-b border-[#283044] px-3 py-2 flex items-center justify-between z-50 sticky top-0 text-xs shadow-md">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5 mr-2 shrink-0 cursor-pointer" onClick={() => onSelectView('customer-search')}>
          <span className="w-2 h-2 rounded-full bg-[#00685f] animate-pulse"></span>
          <span className="font-bold tracking-tight text-white font-headline text-[13px]">genericMed</span>
          <span className="bg-[#008378] text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-white">SaaS Suite</span>
        </div>

        <div className="flex items-center gap-1 shrink-0 bg-[#283044] p-1 rounded-lg">
          <button
            onClick={() => onSelectView('customer-search')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'customer-search'
                ? 'bg-[#00685f] text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#3d4947]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">search_insights</span>
            <span>1. Customer Search</span>
          </button>

          <button
            onClick={() => onSelectView('customer-drug-detail')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'customer-drug-detail'
                ? 'bg-[#00685f] text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#3d4947]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">medication</span>
            <span>2. Drug Equivalency</span>
          </button>

          <button
            onClick={() => onSelectView('customer-cart')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'customer-cart'
                ? 'bg-[#00685f] text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#3d4947]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">shopping_cart</span>
            <span>3. Cart & Revalidation</span>
            {cartCount > 0 && (
              <span className="bg-[#6ffbbe] text-[#002113] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectView('partner-portal')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'partner-portal'
                ? 'bg-[#00685f] text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#3d4947]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">local_pharmacy</span>
            <span>4. Partner Portal (CarePoint Rx)</span>
            <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {partnerOrderCount}
            </span>
          </button>

          <button
            onClick={() => onSelectView('super-admin')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'super-admin'
                ? 'bg-[#00685f] text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#3d4947]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">shield</span>
            <span>5. Super Admin (Root)</span>
          </button>

          <button
            onClick={() => onSelectView('dev-console')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'dev-console'
                ? 'bg-[#00685f] text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#3d4947]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">terminal</span>
            <span>6. Dev Console (API)</span>
          </button>

          <button
            onClick={() => onSelectView('system-architecture')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'system-architecture'
                ? 'bg-[#00685f] text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#3d4947]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">account_tree</span>
            <span>7. Architecture & PRD</span>
          </button>

          <button
            onClick={() => onSelectView('auth')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'auth'
                ? 'bg-[#6ffbbe] text-[#002113] shadow-sm font-bold'
                : 'text-[#6ffbbe] hover:text-white hover:bg-[#3d4947]/40 font-semibold'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
            <span>8. Login & Register</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 pl-2">
        {currentUser ? (
          <div className="flex items-center gap-2 bg-[#283044] px-2 py-1 rounded-lg">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover border border-[#00685f]"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-bold text-[11px] text-white leading-tight truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <span className="text-[9px] text-[#6ffbbe] font-medium leading-tight">
                {currentUser.roleTitle.split(' ')[0]}
              </span>
            </div>
            <button
              onClick={() => onSelectView('auth')}
              title="Account Settings / Switch"
              className="text-gray-400 hover:text-white p-0.5"
            >
              <span className="material-symbols-outlined text-[14px]">manage_accounts</span>
            </button>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="text-gray-400 hover:text-red-400 p-0.5 ml-0.5"
            >
              <span className="material-symbols-outlined text-[14px]">logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSelectView('auth')}
            className="px-2.5 py-1 bg-[#00685f] hover:bg-[#008378] text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm text-[11px]"
          >
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Sign In / Register</span>
          </button>
        )}

        <div className="hidden xl:flex items-center gap-2 text-gray-400 text-[11px] pl-1 border-l border-gray-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6ffbbe]"></span>
          <span>HIPAA Mesh</span>
        </div>
      </div>
    </div>
  );
};
