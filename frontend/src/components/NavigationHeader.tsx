import React from 'react';
import { AppView, UserProfile } from '../types';

interface NavigationHeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  cartCount: number;
  partnerOrderCount: number;
  currentUser: UserProfile | null;
  onLogout: () => void;
  unreadNotificationCount?: number;
  onOpenNotifications?: () => void;
  onOpenPrescriptionModal?: () => void;
  onOpenClinicalAssistant?: () => void;
  onOpenMultiDrugModal?: () => void;
  onOpenMarketplaceModal?: () => void;
  onOpenMultiRegionModal?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentView,
  onSelectView,
  cartCount,
  partnerOrderCount,
  currentUser,
  onLogout,
  unreadNotificationCount = 0,
  onOpenNotifications,
  onOpenPrescriptionModal,
  onOpenClinicalAssistant,
  onOpenMultiDrugModal,
  onOpenMarketplaceModal,
  onOpenMultiRegionModal,
  isDarkMode = false,
  onToggleDarkMode
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
            <span>1. Search</span>
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
            <span>2. Equivalency</span>
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
            <span>3. Cart & Escrow</span>
            {cartCount > 0 && (
              <span className="bg-[#6ffbbe] text-[#002113] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectView('patient-orders')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 whitespace-nowrap ${
              currentView === 'patient-orders'
                ? 'bg-[#00685f] text-white shadow-sm font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#3d4947]/40'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">local_shipping</span>
            <span>4. Track Orders</span>
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
            <span>5. Partner Portal</span>
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
            <span>6. Super Admin</span>
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
            <span>7. Dev API</span>
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
            <span>8. PRD</span>
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
            <span>9. Auth</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 pl-2">
        {/* Clinical Assistant AI */}
        {onOpenClinicalAssistant && (
          <button
            onClick={onOpenClinicalAssistant}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/20 hover:bg-primary/30 text-[#6ffbbe] border border-primary/40 text-[11px] font-bold transition-all"
            title="24/7 AI Clinical Assistant"
          >
            <span className="material-symbols-outlined text-[14px]">smart_toy</span>
            <span>AI Assistant</span>
          </button>
        )}

        {/* Multi-Drug Interaction Quick Trigger */}
        {onOpenMultiDrugModal && (
          <button
            onClick={onOpenMultiDrugModal}
            className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/15 hover:bg-secondary/25 text-[#a0f0e0] border border-secondary/30 text-[11px] font-bold transition-all"
            title="Multi-Drug CYP450 Interaction Checker"
          >
            <span className="material-symbols-outlined text-[14px]">science</span>
            <span>Drug Matrix</span>
          </button>
        )}

        {/* PMS Marketplace Quick Trigger (for pharmacist, developer, superadmin) */}
        {onOpenMarketplaceModal && (currentUser?.role !== 'patient') && (
          <button
            onClick={onOpenMarketplaceModal}
            className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-[#283044] hover:bg-[#3d4947] text-gray-200 border border-gray-600/40 text-[11px] font-medium transition-all"
            title="Pharmacy Management System Marketplace"
          >
            <span className="material-symbols-outlined text-[14px]">hub</span>
            <span>PMS Marketplace</span>
          </button>
        )}

        {/* Multi-Region Cluster Quick Trigger (for superadmin, developer) */}
        {onOpenMultiRegionModal && (currentUser?.role === 'superadmin' || currentUser?.role === 'developer') && (
          <button
            onClick={onOpenMultiRegionModal}
            className="hidden 2xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-[#283044] hover:bg-[#3d4947] text-gray-200 border border-gray-600/40 text-[11px] font-medium transition-all"
            title="Multi-Region Database Replication & Failover"
          >
            <span className="material-symbols-outlined text-[14px]">public</span>
            <span>Regions</span>
          </button>
        )}

        {/* Rx Upload Quick Trigger */}
        {onOpenPrescriptionModal && (
          <button
            onClick={onOpenPrescriptionModal}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-all"
            title="Scan Prescription Slip"
          >
            <span className="material-symbols-outlined text-[14px]">document_scanner</span>
            <span>Scan Rx</span>
          </button>
        )}

        {/* Theme Dark/Light Toggle */}
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg bg-[#283044] hover:bg-[#3d4947] text-gray-300 hover:text-white transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        )}

        {/* Notification Bell */}
        {onOpenNotifications && (
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-lg bg-[#283044] hover:bg-[#3d4947] text-gray-300 hover:text-white transition-colors"
            title="Notifications & SLA Alerts"
            aria-label="Open notifications center"
          >
            <span className="material-symbols-outlined text-[16px]">notifications</span>
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[9px] font-extrabold text-on-primary flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        )}

        {currentUser ? (
          <div className="flex items-center gap-2 bg-[#283044] px-2 py-1 rounded-lg">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover border border-[#00685f]"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-bold text-[11px] text-white leading-tight truncate max-w-[100px]">
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
            <span>Sign In</span>
          </button>
        )}
      </div>
    </div>
  );
};
