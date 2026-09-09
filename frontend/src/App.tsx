import React, { useState, useEffect } from 'react';
import { AppView, CartItem, Medicine, PharmacyOffer, UserProfile } from './types';
import { INITIAL_CART_ITEMS } from './data/mockData';
import { api } from './services/api';
import { NavigationHeader } from './components/NavigationHeader';
import { CustomerHome } from './components/CustomerHome';
import { DrugEquivalency } from './components/DrugEquivalency';
import { CartRevalidation } from './components/CartRevalidation';
import { PartnerPortal } from './components/PartnerPortal';
import { SuperAdminSuite } from './components/SuperAdminSuite';
import { DevConsole } from './components/DevConsole';
import { ArchitecturePrd } from './components/ArchitecturePrd';
import { AuthScreen } from './components/AuthScreen';
import { PatientOrderHistory } from './components/PatientOrderHistory';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { PrescriptionUploadModal } from './components/PrescriptionUploadModal';
import { PharmacyMarketplaceModal } from './components/PharmacyMarketplaceModal';
import { MultiDrugInteractionModal } from './components/MultiDrugInteractionModal';
import { PatientClinicalAssistantModal } from './components/PatientClinicalAssistantModal';
import { MultiRegionStatusModal } from './components/MultiRegionStatusModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('customer-search');
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('gmed_cart_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CART_ITEMS;
      }
    }
    return INITIAL_CART_ITEMS;
  });
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>('atorvastatin-calcium');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isMultiDrugOpen, setIsMultiDrugOpen] = useState(false);
  const [isClinicalAssistantOpen, setIsClinicalAssistantOpen] = useState(false);
  const [isMultiRegionOpen, setIsMultiRegionOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('gmed_theme') === 'dark';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'usr_849201',
    name: 'Sarah Chen',
    email: 'sarah.chen@healthbridge.demo',
    role: 'patient',
    roleTitle: 'Verified Patient',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    orgName: 'Brooklyn Heights Network',
    zipCode: '11201',
    insurancePreference: 'Cash-Pay Discount',
    twoFactorEnabled: false
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gmed_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gmed_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem('gmed_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    api.getMe().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    }).catch(() => {});

    api.getNotifications().then((list) => {
      const unread = list.filter((n) => !n.read).length;
      setUnreadCount(unread);
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavigateToDetail = (medicineId: string) => {
    setSelectedMedicineId(medicineId);
    setCurrentView('customer-drug-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCart = () => {
    setCurrentView('customer-cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCart = (_offer: PharmacyOffer) => {
    setCurrentView('customer-cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (medicine: Medicine) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.medicineId === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.medicineId === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `cart-${medicine.id}`,
          medicineId: medicine.id,
          name: medicine.name,
          strength: medicine.dosage,
          format: 'Caplets',
          countDescription: medicine.packageDescription,
          brandEquivalent: medicine.brandName,
          brandMSRP: medicine.brandPrice,
          price: medicine.lowestPrice,
          savings: medicine.savingsAmount,
          savingsPercentage: medicine.savingsPercent,
          quantity: 1,
          doctorInfo: 'OTC Immediate Dispense',
          npiNumber: 'N/A',
          imageUrl: medicine.imageUrl,
          ndc: medicine.ndc
        };
        return [...prev, newItem];
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleCompleteCheckout = (_total: number, _orderId: string) => {
    // Escrow held and order registered
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col selection:bg-[#00685f]/20">
      {/* Top Universal View Switcher */}
      <NavigationHeader
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartCount}
        partnerOrderCount={14}
        currentUser={currentUser}
        onLogout={handleLogout}
        unreadNotificationCount={unreadCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
        onOpenClinicalAssistant={() => setIsClinicalAssistantOpen(true)}
        onOpenMultiDrugModal={() => setIsMultiDrugOpen(true)}
        onOpenMarketplaceModal={() => setIsMarketplaceOpen(true)}
        onOpenMultiRegionModal={() => setIsMultiRegionOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* View Render */}
      <div className="flex-1 w-full">
        {currentView === 'customer-search' && (
          <CustomerHome
            onNavigateToDetail={handleNavigateToDetail}
            onNavigateToCart={handleNavigateToCart}
            onAddToCart={handleAddToCart}
            cartCount={cartCount}
            currentUser={currentUser}
            onOpenAuth={() => setCurrentView('auth')}
            onNavigateToOrders={() => setCurrentView('patient-orders')}
          />
        )}

        {currentView === 'customer-drug-detail' && (
          <DrugEquivalency
            onBack={() => setCurrentView('customer-search')}
            onProceedToCart={handleProceedToCart}
          />
        )}

        {currentView === 'customer-cart' && (
          <CartRevalidation
            cartItems={cartItems}
            onBack={() => setCurrentView('customer-drug-detail')}
            onUpdateQuantity={handleUpdateQuantity}
            onCompleteCheckout={handleCompleteCheckout}
            onTrackOrder={() => setCurrentView('patient-orders')}
          />
        )}

        {currentView === 'patient-orders' && <PatientOrderHistory />}

        {currentView === 'partner-portal' && <PartnerPortal />}

        {currentView === 'super-admin' && <SuperAdminSuite />}

        {currentView === 'dev-console' && <DevConsole />}

        {currentView === 'system-architecture' && <ArchitecturePrd />}

        {currentView === 'auth' && (
          <AuthScreen
            currentUser={currentUser}
            onLogin={(user, targetView) => {
              setCurrentUser(user);
              if (targetView) {
                setCurrentView(targetView);
              } else {
                setCurrentView('customer-search');
              }
            }}
            onLogout={handleLogout}
            onCancel={() => setCurrentView('customer-search')}
          />
        )}
      </div>

      {/* Global In-App Notifications Modal */}
      <NotificationCenterModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNotificationCountChange={(count) => setUnreadCount(count)}
      />

      {/* Global Prescription Modal */}
      <PrescriptionUploadModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onPrescriptionParsed={(_rx) => {
          handleNavigateToDetail('atorvastatin-calcium');
        }}
      />

      {/* Phase 4: Pharmacy Management System (PMS) Marketplace Modal */}
      <PharmacyMarketplaceModal
        isOpen={isMarketplaceOpen}
        onClose={() => setIsMarketplaceOpen(false)}
      />

      {/* Phase 4: Multi-Drug Clinical Interaction Matrix Modal */}
      <MultiDrugInteractionModal
        isOpen={isMultiDrugOpen}
        onClose={() => setIsMultiDrugOpen(false)}
        preselectedMedicineId={selectedMedicineId}
      />

      {/* Phase 4: 24/7 Patient Clinical Support Assistant Modal */}
      <PatientClinicalAssistantModal
        isOpen={isClinicalAssistantOpen}
        onClose={() => setIsClinicalAssistantOpen(false)}
        onNavigate={(view, id) => {
          if (view === 'customer-drug-detail' && id) {
            handleNavigateToDetail(id);
          } else {
            setCurrentView(view as any);
          }
        }}
        onOpenMultiDrug={() => setIsMultiDrugOpen(true)}
      />

      {/* Phase 4: Multi-Region Database Replication & Failover Modal */}
      <MultiRegionStatusModal
        isOpen={isMultiRegionOpen}
        onClose={() => setIsMultiRegionOpen(false)}
      />
    </div>
  );
}

