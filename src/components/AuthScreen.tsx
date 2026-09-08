import React, { useState } from 'react';
import { UserProfile, AppView } from '../types';

interface AuthScreenProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile, targetView?: AppView) => void;
  onLogout: () => void;
  onCancel?: () => void;
}

type AuthMode = 'login' | 'register';
type RoleType = 'patient' | 'pharmacist' | 'developer' | 'superadmin';

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onCancel,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<RoleType>('patient');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState<string>('sarah.chen@healthbridge.demo');
  const [loginPassword, setLoginPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [totpCode, setTotpCode] = useState<string>('');
  const [requireTotp, setRequireTotp] = useState<boolean>(false);

  // Register Form States
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regShowPassword, setRegShowPassword] = useState<boolean>(false);
  
  // Role-Specific Registration States
  // Patient
  const [patientDob, setPatientDob] = useState<string>('1988-04-14');
  const [patientZip, setPatientZip] = useState<string>('11201');
  const [insurancePref, setInsurancePref] = useState<'Cash-Pay Discount' | 'Commercial Insurance' | 'Medicare / Medicaid'>('Cash-Pay Discount');
  
  // Pharmacist
  const [pharmacyName, setPharmacyName] = useState<string>('CarePoint Rx Dispensary');
  const [licenseNumber, setLicenseNumber] = useState<string>('NY-PHARM-882910');
  const [deaNumber, setDeaNumber] = useState<string>('BC1928491-049');
  const [npiNumber, setNpiNumber] = useState<string>('1892019482');
  
  // Developer
  const [devOrgName, setDevOrgName] = useState<string>('HealthBridge Telehealth Inc.');
  const [devEnvironment, setDevEnvironment] = useState<'Production' | 'Sandbox'>('Sandbox');
  const [devWebhookUrl, setDevWebhookUrl] = useState<string>('https://api.healthbridge.io/webhooks/rx');

  // SuperAdmin
  const [adminOrgCode, setAdminOrgCode] = useState<string>('GM-ROOT-SEC18-ORCH');
  const [yubikeySerial, setYubikeySerial] = useState<string>('YUBI-9921-FIDO2');

  // Consent & Preferences
  const [hipaaConsent, setHipaaConsent] = useState<boolean>(true);
  const [enable2FA, setEnable2FA] = useState<boolean>(true);

  // Modals & Feedback
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Demo Presets for Quick Auto-Fill
  const demoAccounts: Record<RoleType, { email: string; pass: string; name: string; title: string; avatar: string; org?: string; dea?: string; target: AppView }> = {
    patient: {
      email: 'sarah.chen@healthbridge.demo',
      pass: 'GenericMed2026!Patient',
      name: 'Sarah Chen',
      title: 'Verified Patient',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      org: 'Brooklyn Heights Network',
      target: 'customer-search'
    },
    pharmacist: {
      email: 'marcus.vance@carepointrx.org',
      pass: 'CarePointRx2026#Pharm',
      name: 'Dr. Marcus Vance, PharmD',
      title: 'Lead Dispensing Pharmacist',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      org: 'CarePoint Rx #US-CP-049',
      dea: 'BC1928491-049',
      target: 'partner-portal'
    },
    developer: {
      email: 'dev.lead@healthbridge.io',
      pass: 'ApiGateway2026$Dev',
      name: 'Alex Rivera',
      title: 'Integration Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      org: 'HealthBridge Telehealth Systems',
      target: 'dev-console'
    },
    superadmin: {
      email: 'elena.vance@genericmed.root',
      pass: 'RootOrchestrator2026!Sec18',
      name: 'Dr. Elena Vance',
      title: 'Global Root SuperAdmin',
      avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1Wy7VvC1evCNrHbcHWsqYoIQY1yIiBgLtufmHg6ei71FLzorFc3-VoB0tJ-NgkESv_X4sG2xu_jJe1xHcZwGkd39HO4RsMdtEd3UOaUysr3p68B-D-QcBzOgz2i_fV0NVmJBzNUpHegPShpxrmf7qDgUANlTGAQTAkpWpt_VOyvU8WuTHtHsG8Cs0uYZwCB7S58aau2SzPnqWGzz2cSwoTH-mxgw2kAlDSvu2WCLA-FbXStZx4bPBaZ9w',
      org: 'genericMed Foundation',
      target: 'super-admin'
    }
  };

  const handleApplyDemoAccount = (role: RoleType) => {
    setSelectedRole(role);
    const demo = demoAccounts[role];
    setLoginEmail(demo.email);
    setLoginPassword(demo.pass);
    if (role === 'pharmacist' || role === 'superadmin') {
      setRequireTotp(true);
      setTotpCode('849201');
    } else {
      setRequireTotp(false);
      setTotpCode('');
    }
    showToast(`Loaded ${demo.name} (${demo.title}) demo credentials`);
  };

  // Password Strength Calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(regPassword);
  const passwordStrengthLabel = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'][passwordScore];
  const passwordStrengthColor = [
    'bg-gray-200 text-gray-400',
    'bg-red-400 text-red-600',
    'bg-amber-400 text-amber-600',
    'bg-teal-500 text-teal-600',
    'bg-[#00685f] text-[#00685f]'
  ][passwordScore];

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      alert('Please provide an email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demo = demoAccounts[selectedRole];
      const user: UserProfile = {
        id: `usr_${Math.floor(100000 + Math.random() * 900000)}`,
        name: loginEmail === demo.email ? demo.name : loginEmail.split('@')[0].replace('.', ' '),
        email: loginEmail,
        role: selectedRole,
        roleTitle: demo.title,
        avatarUrl: demo.avatar,
        orgName: demo.org,
        deaOrNpi: demo.dea,
        twoFactorEnabled: requireTotp || selectedRole === 'pharmacist' || selectedRole === 'superadmin'
      };

      onLogin(user, demo.target);
      showToast(`Welcome back, ${user.name}! Authenticated as ${user.roleTitle}`);
    }, 600);
  };

  // Handle Register Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regPassword) {
      alert('Please fill in all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      alert('Passwords do not match. Please verify.');
      return;
    }
    if (!hipaaConsent) {
      alert('Please agree to the HIPAA Privacy Notice and Terms of Service to continue.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      let roleTitle = 'Registered Patient';
      let org = 'Independent Patient';
      let dea = undefined;

      if (selectedRole === 'pharmacist') {
        roleTitle = 'Accredited Pharmacist';
        org = pharmacyName;
        dea = `${deaNumber} / NPI: ${npiNumber}`;
      } else if (selectedRole === 'developer') {
        roleTitle = 'API Developer Partner';
        org = devOrgName;
      } else if (selectedRole === 'superadmin') {
        roleTitle = 'Platform Security Operator';
        org = 'genericMed Orchestrator';
      }

      const newUser: UserProfile = {
        id: `usr_${Math.floor(100000 + Math.random() * 900000)}`,
        name: regFullName,
        email: regEmail,
        role: selectedRole,
        roleTitle,
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        phone: regPhone,
        orgName: org,
        deaOrNpi: dea,
        zipCode: patientZip,
        insurancePreference: insurancePref,
        twoFactorEnabled: enable2FA
      };

      const demo = demoAccounts[selectedRole];
      onLogin(newUser, demo.target);
      showToast(`Account successfully created for ${newUser.name}!`);
    }, 700);
  };

  const handleSimulateSSO = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const demo = demoAccounts[selectedRole];
      const user: UserProfile = {
        id: `sso_${Math.floor(100000 + Math.random() * 900000)}`,
        name: demo.name,
        email: demo.email,
        role: selectedRole,
        roleTitle: `${demo.title} (via ${provider})`,
        avatarUrl: demo.avatar,
        orgName: demo.org,
        twoFactorEnabled: true
      };
      onLogin(user, demo.target);
      showToast(`Authenticated seamlessly via ${provider}!`);
    }, 600);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      alert('Please enter your email.');
      return;
    }
    setIsForgotPasswordOpen(false);
    showToast(`Password reset link dispatched to ${forgotEmail}. Link expires in 15 minutes.`);
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-[calc(100vh-40px)] flex flex-col justify-center items-center py-8 px-4 font-body">
      {/* Background Decorative Mesh Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00685f]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#006398]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#eaedff] overflow-hidden flex flex-col transition-all">
        {/* Top Header Ribbon */}
        <div className="bg-[#131b2e] text-white p-5 border-b border-[#283044] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#00685f] flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline font-bold text-base tracking-tight text-white">
                    genericMed
                  </span>
                  <span className="bg-[#00685f] text-white text-[10px] font-bold px-2 py-0.5 rounded font-data-mono">
                    SECURE AUTH GATEWAY
                  </span>
                </div>
                <p className="text-[11px] text-gray-300">
                  HIPAA Title II • DEA Electronic Prescriptions (EPCS) • 256-bit TLS Encrypted
                </p>
              </div>
            </div>

            {onCancel && (
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
                title="Return to previous screen"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-[#283044] p-1 rounded-xl gap-1">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-[#00685f] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Sign In to genericMed</span>
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-[#00685f] text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Create New Account</span>
            </button>
          </div>
        </div>

        {/* Existing Session Notice Banner (if already logged in) */}
        {currentUser && (
          <div className="bg-[#eaedff] border-b border-[#dae2fd] px-5 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-gray-300 object-cover"
              />
              <div>
                <span className="text-gray-600">Currently signed in as: </span>
                <span className="font-bold text-[#131b2e]">{currentUser.name}</span>
                <span className="ml-1.5 bg-[#00685f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {currentUser.roleTitle}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onLogout();
                showToast('Signed out successfully.');
              }}
              className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-600 font-bold rounded-lg border border-red-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Role Selection Strip */}
        <div className="p-5 pb-2 border-b border-[#eaedff] flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Select User Persona / Workspace Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {
                id: 'patient',
                label: 'Patient / Consumer',
                icon: 'personal_injury',
                desc: 'Generic savings & Rx lock'
              },
              {
                id: 'pharmacist',
                label: 'Pharmacy Partner',
                icon: 'local_pharmacy',
                desc: 'POS dispensing & DEA seal'
              },
              {
                id: 'developer',
                label: 'B2B / Telehealth',
                icon: 'terminal',
                desc: 'EHR REST API & webhooks'
              },
              {
                id: 'superadmin',
                label: 'Super Admin',
                icon: 'shield',
                desc: 'Multi-tenant shard root'
              }
            ].map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleApplyDemoAccount(role.id as RoleType)}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  selectedRole === role.id
                    ? 'border-[#00685f] bg-[#00685f]/5 ring-1 ring-[#00685f]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      selectedRole === role.id ? 'text-[#00685f]' : 'text-gray-500'
                    }`}
                  >
                    {role.icon}
                  </span>
                  {selectedRole === role.id && (
                    <span className="w-2 h-2 rounded-full bg-[#00685f]"></span>
                  )}
                </div>
                <span className="font-bold text-xs text-[#131b2e] leading-tight">
                  {role.label}
                </span>
                <span className="text-[10px] text-gray-500 leading-tight">
                  {role.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Quick Demo Pre-Fill Action */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#00685f]">info</span>
              <span>1-Click Test: Click any role to auto-populate accredited credentials</span>
            </span>
            <button
              type="button"
              onClick={() => handleApplyDemoAccount(selectedRole)}
              className="text-[11px] font-bold text-[#00685f] hover:underline"
            >
              Reload {selectedRole.toUpperCase()} Demo
            </button>
          </div>
        </div>

        {/* Main Body: Login vs Register Form */}
        <div className="p-5 flex flex-col gap-4">
          {authMode === 'login' ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-700">Email Address or Username</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-gray-400 text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. name@healthbridge.io"
                    className="w-full bg-[#f2f3ff] border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-[11px] text-[#00685f] font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-gray-400 text-[18px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#f2f3ff] border border-gray-200 rounded-lg pl-9 pr-10 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication Prompt (for clinical & admin roles) */}
              {(requireTotp || selectedRole === 'pharmacist' || selectedRole === 'superadmin') && (
                <div className="bg-[#eaedff] p-3 rounded-xl border border-[#dae2fd] flex flex-col gap-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-[#00685f]">
                      <span className="material-symbols-outlined text-[16px]">verified_user</span>
                      <span>DEA Sec 18 / 2-Factor Authentication Required</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-data-mono">Authenticator / SMS</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-gray-400 text-[18px]">
                      pin
                    </span>
                    <input
                      type="text"
                      maxLength={6}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      placeholder="6-digit Authenticator Code (e.g. 849201)"
                      className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs font-data-mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                    />
                  </div>
                </div>
              )}

              {/* Remember Me & 2FA Toggle */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#00685f] focus:ring-[#00685f] h-3.5 w-3.5"
                  />
                  <span>Remember this device for 30 days</span>
                </label>

                <button
                  type="button"
                  onClick={() => setRequireTotp(!requireTotp)}
                  className="text-[11px] text-gray-500 hover:text-[#00685f] underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">shield</span>
                  <span>{requireTotp ? 'Hide 2FA challenge' : 'Use 2FA / Hardware Key'}</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    <span>Validating credentials & DEA certificates...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">lock_open</span>
                    <span>Sign In Securely ({selectedRole.toUpperCase()})</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-2 flex items-center justify-center">
                <div className="border-t border-gray-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] text-gray-400 uppercase tracking-wider font-semibold absolute">
                  or authenticate with
                </span>
              </div>

              {/* SSO Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateSSO('Google Workspace')}
                  className="py-2 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.37 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateSSO('Surescripts / Epic MyChart')}
                  className="py-2 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[#00685f] text-[18px]">domain_verification</span>
                  <span>Epic / Surescripts</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateSSO('FIDO2 Passkey')}
                  className="py-2 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[#006398] text-[18px]">fingerprint</span>
                  <span>Passkey</span>
                </button>
              </div>
            </form>
          ) : (
            /* ================= REGISTRATION FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3 text-xs">
              <div className="bg-[#f2f3ff] p-3 rounded-xl border border-[#eaedff] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00685f] text-[20px]">
                  verified
                </span>
                <span className="text-gray-700 leading-snug">
                  Creating an account as <strong className="text-[#00685f] capitalize">{selectedRole}</strong>.
                  Registration complies with DEA Title 21 and HIPAA Patient Rights.
                </span>
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Dr. Jane Doe or Jane Doe"
                    className="bg-[#f2f3ff] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700">Work or Personal Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="bg-[#f2f3ff] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                  />
                </div>
              </div>

              {/* Password & Confirm Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700">Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={regShowPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 number, 1 symbol"
                      className="w-full bg-[#f2f3ff] border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                    />
                    <button
                      type="button"
                      onClick={() => setRegShowPassword(!regShowPassword)}
                      className="absolute right-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {regShowPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {regPassword && (
                    <div className="flex items-center justify-between text-[10px] mt-0.5">
                      <span className="text-gray-500">Strength:</span>
                      <span className={`font-bold ${passwordStrengthColor}`}>
                        {passwordStrengthLabel}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="bg-[#f2f3ff] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                  />
                  {regConfirmPassword && (
                    <div className="flex items-center gap-1 text-[10px] mt-0.5">
                      {regPassword === regConfirmPassword ? (
                        <span className="text-[#006947] font-bold">✓ Passwords match</span>
                      ) : (
                        <span className="text-red-500 font-bold">✗ Passwords do not match</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Phone */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-700">Mobile Phone (for delivery SMS & 2FA)</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="bg-[#f2f3ff] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                />
              </div>

              {/* Role-Specific Fields */}
              {selectedRole === 'patient' && (
                <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff] flex flex-col gap-2">
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#00685f]">home_pin</span>
                    <span>Patient Delivery & Prescription Preferences</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-gray-600">Date of Birth</label>
                      <input
                        type="date"
                        value={patientDob}
                        onChange={(e) => setPatientDob(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-gray-600">Delivery Zip Code</label>
                      <input
                        type="text"
                        value={patientZip}
                        onChange={(e) => setPatientZip(e.target.value)}
                        placeholder="11201"
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-gray-600">Payment Model</label>
                      <select
                        value={insurancePref}
                        onChange={(e) => setInsurancePref(e.target.value as any)}
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800"
                      >
                        <option value="Cash-Pay Discount">Cash-Pay Discount (Up to 92% off)</option>
                        <option value="Commercial Insurance">Commercial Insurance</option>
                        <option value="Medicare / Medicaid">Medicare / Medicaid</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'pharmacist' && (
                <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff] flex flex-col gap-2">
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#00685f]">badge</span>
                    <span>Dispensary Licensing & DEA Compliance Credentials</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-gray-600">Dispensary Organization</label>
                      <input
                        type="text"
                        value={pharmacyName}
                        onChange={(e) => setPharmacyName(e.target.value)}
                        placeholder="e.g. CarePoint Rx #US-CP-049"
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-gray-600">State Pharmacy License #</label>
                      <input
                        type="text"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        placeholder="NY-PHARM-882910"
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-gray-600">DEA Registration (Title 21)</label>
                      <input
                        type="text"
                        value={deaNumber}
                        onChange={(e) => setDeaNumber(e.target.value)}
                        placeholder="BC1928491-049"
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-data-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-gray-600">Individual Pharmacist NPI</label>
                      <input
                        type="text"
                        value={npiNumber}
                        onChange={(e) => setNpiNumber(e.target.value)}
                        placeholder="1892019482"
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-data-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'developer' && (
                <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff] flex flex-col gap-2">
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#00685f]">code</span>
                    <span>B2B Healthcare Integration Specs</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-gray-600">Company / EHR System</label>
                      <input
                        type="text"
                        value={devOrgName}
                        onChange={(e) => setDevOrgName(e.target.value)}
                        placeholder="HealthBridge Telehealth Inc."
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-gray-600">Initial Cluster</label>
                      <select
                        value={devEnvironment}
                        onChange={(e) => setDevEnvironment(e.target.value as any)}
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800"
                      >
                        <option value="Sandbox">Developer Sandbox (Mock Clearinghouse)</option>
                        <option value="Production">Live Production (mTLS Required)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[11px] font-semibold text-gray-600">Webhook Dispatch URL</label>
                      <input
                        type="url"
                        value={devWebhookUrl}
                        onChange={(e) => setDevWebhookUrl(e.target.value)}
                        placeholder="https://api.yourdomain.com/webhooks/rx"
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-data-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'superadmin' && (
                <div className="p-3 bg-[#faf8ff] rounded-xl border border-[#eaedff] flex flex-col gap-2">
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#00685f]">key</span>
                    <span>Root Authorization & Hardware Key Enrollment</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-gray-600">Root Organization Code</label>
                      <input
                        type="text"
                        value={adminOrgCode}
                        onChange={(e) => setAdminOrgCode(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-data-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-gray-600">FIDO2 / YubiKey Serial</label>
                      <input
                        type="text"
                        value={yubikeySerial}
                        onChange={(e) => setYubikeySerial(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-800 font-data-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Consent & Security Checkboxes */}
              <div className="flex flex-col gap-2 pt-1 border-t border-gray-100">
                <label className="flex items-start gap-2 cursor-pointer text-gray-600 select-none">
                  <input
                    type="checkbox"
                    required
                    checked={hipaaConsent}
                    onChange={(e) => setHipaaConsent(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-[#00685f] focus:ring-[#00685f] h-3.5 w-3.5"
                  />
                  <span className="text-[11px]">
                    I consent to genericMed's <strong>HIPAA Notice of Privacy Practices</strong>, FDA AB bioequivalence substitution policy, and electronic prescription routing terms.
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
                  <input
                    type="checkbox"
                    checked={enable2FA}
                    onChange={(e) => setEnable2FA(e.target.checked)}
                    className="rounded border-gray-300 text-[#00685f] focus:ring-[#00685f] h-3.5 w-3.5"
                  />
                  <span className="text-[11px]">
                    Enable Two-Factor Authentication (2FA) for prescription changes and checkout price locks.
                  </span>
                </label>
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    <span>Verifying and establishing encrypted tenant profile...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                    <span>Complete Registration & Open Portal</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info ribbon */}
        <div className="bg-[#faf8ff] border-t border-[#eaedff] px-5 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006947] text-[16px]">lock</span>
            <span>256-Bit SSL/TLS • HIPAA Security Rule § 164.312 • DEA Title 21 Compliant</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast('Privacy Policy: All PHI is encrypted at rest with AES-256 and never sold.')}
              className="hover:text-gray-800 transition-colors underline"
            >
              Privacy Notice
            </button>
            <span>•</span>
            <button
              onClick={() => showToast('Terms: Bioequivalence substitutions adhere to FDA Orange Book standards.')}
              className="hover:text-gray-800 transition-colors underline"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-100 flex flex-col gap-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00685f] text-[22px]">
                  lock_reset
                </span>
                <h3 className="font-headline font-bold text-sm text-[#131b2e]">
                  Reset Account Password
                </h3>
              </div>
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Enter your registered email address. We will send a secure, one-time cryptographically signed password reset link expiring in 15 minutes.
            </p>

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-700">Account Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah.chen@healthbridge.demo"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="bg-[#f2f3ff] border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold rounded-lg shadow-sm"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#131b2e] text-white px-4 py-2.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs font-medium border border-gray-700 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
