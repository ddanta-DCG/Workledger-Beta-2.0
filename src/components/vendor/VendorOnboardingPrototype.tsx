'use client';

import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Upload,
  FileText,
  Building2,
  User2,
  ShieldCheck,
  Banknote,
  TimerReset,
  Mail,
} from "lucide-react";
import { vendorOnboardingStyles } from "./vendorOnboardingStyles";
// ============================================================================
// SELF-CONTAINED UI PRIMITIVES (so preview/build works without external files)
// ============================================================================
export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "outline" | "ghost" }
> = ({ className = "", variant, ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition";
  const styles =
    variant === "outline"
      ? "border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
      : variant === "ghost"
      ? "text-gray-600 hover:text-blue-600"
      : "bg-blue-600 text-white hover:bg-blue-700";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
};

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}
    {...props}
  />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => <div className={className} {...props} />;

// ============================================================================
// TYPES
// ============================================================================
type StepKey = "welcome" | "type" | "basics" | "w9" | "bank" | "review" | "done";
type BankStatus = "not_started" | "pending" | "verified";
type VendorType = "individual" | "business" | null;
interface Step { key: StepKey; label: string }

// ============================================================================
// BRANDING (FIX: define LOGO_SRC so build doesn't throw ReferenceError)
// ============================================================================
// Prefer the public file. If not served (e.g., preview), we fall back to inline SVG.
const LOGO_SRC = "/workledger-logo.png";
const LOGO_FALLBACK_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns='http://www.w3.org/2000/svg' width='240' height='54' viewBox='0 0 240 54'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#5865F2'/>
        <stop offset='100%' stop-color='#3B5BFF'/>
      </linearGradient>
    </defs>
    <rect width='240' height='54' fill='white'/>
    <g font-family='Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' font-size='28' font-weight='700'>
      <text x='4' y='36' fill='url(#g)'>W</text>
      <text x='28' y='36' fill='#0F172A'>ork</text>
      <text x='77' y='36' fill='url(#g)'>l</text>
      <text x='86' y='36' fill='#0F172A'>edger</text>
    </g>
  </svg>`);

// ============================================================================
// STEPS
// ============================================================================
const steps: Step[] = [
  { key: "welcome", label: "Welcome" },
  { key: "type", label: "Vendor Type" },
  { key: "basics", label: "Vendor Basics" },
  { key: "w9", label: "W-9 Upload" },
  { key: "bank", label: "Bank Setup" },
  { key: "review", label: "Review" },
  { key: "done", label: "All Set" },
];

const Stepper: React.FC<{ index: number }> = ({ index }) => (
  <div className="w-full flex items-center gap-2 md:gap-3 my-6">
    {steps.map((s, i) => (
      <div key={s.key} className="flex-1 flex items-center gap-2">
        <div
          className={`h-1 w-full rounded-full transition-all ${
            i <= index ? "bg-blue-600" : "bg-gray-200"
          }`}
        />
      </div>
    ))}
  </div>
);

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Card className="border border-gray-100 shadow-sm rounded-2xl">
    <CardContent className="p-6 md:p-10 space-y-6">{children}</CardContent>
  </Card>
);

const TapCard: React.FC<{
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
  onClick: () => void;
  selected: boolean;
}> = ({ icon: Icon, title, subtitle, onClick, selected }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 min-w-[140px] rounded-2xl border-2 p-6 md:p-8 text-left transition ${
      selected
        ? "border-blue-600 bg-blue-50"
        : "border-gray-200 bg-white hover:border-blue-400"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="p-3 rounded-xl bg-gray-100">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <div className="text-lg md:text-xl font-semibold">{title}</div>
        <div className="text-sm md:text-base text-gray-500">{subtitle}</div>
      </div>
    </div>
  </button>
);

const Input: React.FC<{
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}> = ({ label, placeholder, value, onChange, type = "text", required }) => (
  <label className="block space-y-2 w-full">
    <span className="text-sm md:text-base font-medium text-gray-700">
      {label}
      {required && <span className="text-rose-500">*</span>}
    </span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 px-4 py-3 md:py-4 text-base md:text-lg"
    />
  </label>
);

const FileDrop: React.FC<{
  label: string;
  file: File | null;
  onFile: (f: File) => void;
}> = ({ label, file, onFile }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const takeFirstPdf = (files: FileList | null) => {
    if (!files || !files.length) return;
    const f = files[0];
    const isPdf =
      f?.type === "application/pdf" || f?.name?.toLowerCase().endsWith(".pdf");
    if (!isPdf) return;
    onFile(f);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm md:text-base font-medium text-gray-700">
        {label} <span className="text-rose-500">*</span>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          setIsDragging(false);
          takeFirstPdf(e.dataTransfer?.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-6 md:p-10 text-center transition cursor-pointer ${
          isDragging ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <Upload className="h-8 w-8 text-blue-600" />
          <div className="text-base md:text-lg">Drop PDF here or tap to upload</div>
          <div className="text-sm text-gray-500">W-9 (PDF)</div>
          {file && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-blue-700">
              <FileText className="h-4 w-4" /> {file.name}
            </div>
          )}
        </div>
        <input
          type="file"
          accept="application/pdf,.pdf"
          ref={inputRef}
          className="hidden"
          onChange={(e) => takeFirstPdf(e.target.files)}
        />
      </div>
    </div>
  );
};

function useStopwatch(active: boolean): string {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setMs((m) => m + 100), 100);
    return () => clearInterval(id);
  }, [active]);
  const pretty = useMemo(() => {
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [ms]);
  return pretty;
}

// ============================================================================
// FORMAT HELPERS (SSN/EIN masking as the user types)
// ============================================================================
const onlyDigits = (s: string) => s.replace(/[^0-9]/g, "");
export const formatSSN = (raw: string) => {
  const d = onlyDigits(raw).slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
};
export const formatEIN = (raw: string) => {
  const d = onlyDigits(raw).slice(0, 9);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}-${d.slice(2)}`;
};

// Specialized input that stores RAW digits but DISPLAYS with dashes.
const MaskedTaxIdInput: React.FC<{
  isBusiness: boolean;
  value: string; // raw digits only
  onChange: (raw: string) => void;
  required?: boolean;
}> = ({ isBusiness, value, onChange, required }) => {
  const label = isBusiness ? "EIN" : "SSN";
  const placeholder = isBusiness ? "12-3456789" : "123-45-6789";
  const formatted = isBusiness ? formatEIN(value) : formatSSN(value);
  return (
    <label className="block space-y-2 w-full">
      <span className="text-sm md:text-base font-medium text-gray-700">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </span>
      <input
        inputMode="numeric"
        autoComplete="off"
        type="text"
        value={formatted}
        placeholder={placeholder}
        onChange={(e) => onChange(onlyDigits(e.target.value).slice(0, 9))}
        onPaste={(e) => {
          const pasted = e.clipboardData.getData("text") || "";
          onChange(onlyDigits(pasted).slice(0, 9));
          e.preventDefault();
        }}
        className="w-full rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-0 px-4 py-3 md:py-4 text-base md:text-lg tracking-wider"
      />
    </label>
  );
};

// ============================================================================
// PURE HELPER + MICRO TESTS (keeps behavior verifiable)
// ============================================================================
export function canContinueForStep(
  key: StepKey,
  state: {
    type: VendorType;
    name: string;
    business: string;
    email: string;
    address: string;
    taxId: string;
    w9: File | null;
    consent: boolean;
    bankStatus: BankStatus;
  }
): boolean {
  if (key === "type") return Boolean(state.type);
  if (key === "basics")
    return (
      (state.type === "business" ? state.business : state.name) &&
      state.email &&
      state.address &&
      state.taxId
    )
      ? true
      : false;
  if (key === "w9") return Boolean(state.w9) && state.consent;
  if (key === "bank") return state.bankStatus !== "not_started";
  if (key === "review") return true;
  return false;
}

// Lightweight console assertions (do not fail build; help us catch regressions)
try {
  console.assert(
    canContinueForStep("type", {
      type: "individual",
      name: "",
      business: "",
      email: "",
      address: "",
      taxId: "",
      w9: null,
      consent: false,
      bankStatus: "not_started",
    }) === true,
    "type step should pass when type is set"
  );
  console.assert(
    canContinueForStep("w9", {
      type: "individual",
      name: "",
      business: "",
      email: "",
      address: "",
      taxId: "",
      w9: null,
      consent: true,
      bankStatus: "not_started",
    }) === false,
    "w9 requires a file"
  );
  console.assert(
    canContinueForStep("bank", {
      type: "individual",
      name: "",
      business: "",
      email: "",
      address: "",
      taxId: "",
      w9: null,
      consent: false,
      bankStatus: "pending",
    }) === true,
    "bank passes when pending or verified"
  );
  // New: formatting asserts
  console.assert(formatSSN("123456789") === "123-45-6789", "SSN masks correctly");
  console.assert(formatEIN("123456789") === "12-3456789", "EIN masks correctly");
  console.assert(formatSSN("1234") === "123-4", "SSN partial mask");
  console.assert(formatEIN("12") === "12", "EIN partial mask");
} catch {}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function VendorOnboardingPrototype() {
  const [idx, setIdx] = useState<number>(0);
  const [type, setType] = useState<"individual" | "business">("individual");
  const [name, setName] = useState<string>("");
  const [business, setBusiness] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [taxId, setTaxId] = useState<string>("");
  const [w9, setW9] = useState<File | null>(null);
  const [consent, setConsent] = useState<boolean>(false);
  const [bankStatus, setBankStatus] = useState<BankStatus>("not_started");

  const time = useStopwatch(idx > 0 && idx < steps.length - 1);
  const next = () => setIdx((i) => Math.min(i + 1, steps.length - 1));
  const back = () => setIdx((i) => Math.max(i - 1, 0));

  const canContinue = useMemo(
    () =>
      canContinueForStep(steps[idx].key, {
        type,
        name,
        business,
        email,
        address,
        taxId,
        w9,
        consent,
        bankStatus,
      }),
    [idx, type, name, business, email, address, taxId, w9, consent, bankStatus]
  );

  const startStripe = () => {
    setBankStatus("pending");
    setTimeout(() => setBankStatus("verified"), 1500);
  };
  const handleVendorRegister = () => {
    alert("Redirecting to WorkLedger Vendor registration...");
  };

  return (
    <>
    <style
        data-vendor-onboarding
        dangerouslySetInnerHTML={{ __html: vendorOnboardingStyles }}
      />
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <header className="mx-auto max-w-3xl px-5 pt-6 md:pt-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={LOGO_SRC}
            alt="WorkLedger"
            className="h-10 w-auto"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = LOGO_FALLBACK_SVG;
            }}
          />
          <div className="sr-only">WorkLedger</div>
        </div>
        <div className="flex items-center gap-2 text-sm md:text-base text-gray-500">
          <TimerReset className="h-4 w-4" /> <span>Time: {time}</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24">
        <Stepper index={idx} />
        <AnimatePresence mode="wait">
          <motion.div
            key={steps[idx].key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {/* WELCOME */}
            {steps[idx].key === "welcome" && (
              <Section>
                <div className="space-y-6 md:space-y-8 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl md:text-4xl font-bold text-gray-900">
                      You’re invited to get paid or receive payments
                    </div>
                    <div className="text-gray-600 md:text-lg">
                      This takes about 2 minutes. We’ll guide you step by step.
                    </div>
                  </div>
                  <div className="flex gap-3 items-center justify-center text-sm text-gray-600">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    <span>
                      Bank & tax info handled securely by Stripe. WorkLedger never stores
                      your raw details.
                    </span>
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg px-6 py-6 rounded-xl"
                    onClick={next}
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Section>
            )}

            {/* TYPE */}
            {steps[idx].key === "type" && (
              <Section>
                <div className="space-y-6">
                  <div className="text-3xl font-bold">Who are you?</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TapCard
                      icon={User2}
                      title="Individual / Sole Proprietor"
                      subtitle="Use SSN and personal address"
                      onClick={() => setType("individual")}
                      selected={type === "individual"}
                    />
                    <TapCard
                      icon={Building2}
                      title="Business / LLC / Corp"
                      subtitle="Use EIN and business address"
                      onClick={() => setType("business")}
                      selected={type === "business"}
                    />
                  </div>
                </div>
              </Section>
            )}

            {/* BASICS */}
            {steps[idx].key === "basics" && (
              <Section>
                <div className="space-y-6">
                  <div className="text-3xl font-bold">Your basics</div>
                  <div className="grid gap-4">
                    {type === "business" ? (
                      <Input
                        label="Legal Business Name"
                        placeholder="Acme, Inc."
                        value={business}
                        onChange={setBusiness}
                        required
                      />
                    ) : (
                      <Input
                        label="Full Legal Name"
                        placeholder="Jane Doe"
                        value={name}
                        onChange={setName}
                        required
                      />
                    )}
                    <Input
                      label="Email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={setEmail}
                      type="email"
                      required
                    />
                    <Input
                      label="Mailing Address"
                      placeholder="Street, City, State, ZIP"
                      value={address}
                      onChange={setAddress}
                      required
                    />
                    <MaskedTaxIdInput
                      isBusiness={type === "business"}
                      value={taxId}
                      onChange={setTaxId}
                      required
                    />
                  </div>
                </div>
              </Section>
            )}

            {/* W9 */}
            {steps[idx].key === "w9" && (
              <Section>
                <div className="space-y-6">
                  <div className="text-3xl font-bold">Upload W-9</div>
                  <FileDrop label="Attach signed W-9 (PDF)" file={w9} onFile={setW9} />
                  <label className="flex items-start gap-3 text-sm md:text-base">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    <span>
                      I certify the information is correct and I’m authorized to submit
                      this form.
                    </span>
                  </label>
                </div>
              </Section>
            )}

            {/* BANK */}
            {steps[idx].key === "bank" && (
              <Section>
                <div className="space-y-6">
                  <div className="text-3xl font-bold">Bank setup</div>
                  <div className="text-gray-600">
                    ACH and check supported. Wire available for international vendors.
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-6 md:p-8 bg-white">
                    <div className="flex items-center gap-3">
                      <Banknote className="h-6 w-6 text-blue-600" />
                      <div className="font-medium">Secure Stripe onboarding</div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      We’ll send you to Stripe to connect your bank. You’ll return here when
                      finished.
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {bankStatus === "not_started" && (
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-6 rounded-xl"
                          onClick={startStripe}
                        >
                          Continue to Stripe <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      )}
                      {bankStatus !== "not_started" && (
                        <div
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
                            bankStatus === "verified"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          <ShieldCheck className="h-4 w-4" />
                          {bankStatus === "verified" ? "Verified" : "Pending verification"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* REVIEW */}
            {steps[idx].key === "review" && (
              <Section>
                <div className="space-y-6">
                  <div className="text-3xl font-bold">Review & confirm</div>
                  <div className="grid gap-3 text-sm md:text-base">
                    <SummaryRow
                      label="Type"
                      value={type === "business" ? "Business" : "Individual"}
                    />
                    <SummaryRow label="Name" value={type === "business" ? business : name} />
                    <SummaryRow label="Email" value={email} />
                    <SummaryRow label="Address" value={address} />
                    <SummaryRow label="Tax ID" value={taxId ? "•••" + taxId.slice(-4) : "—"} />
                    <SummaryRow label="W-9" value={w9?.name || "—"} />
                    <SummaryRow
                      label="Bank status"
                      value={bankStatus === "verified" ? "Verified" : "Pending"}
                    />
                  </div>
                </div>
              </Section>
            )}

            {/* DONE */}
            {steps[idx].key === "done" && (
              <Section>
                <div className="flex flex-col items-center text-center gap-5 py-10">
                  <CheckCircle2 className="h-12 w-12 text-blue-600" />
                  <div className="text-3xl font-bold text-gray-900">You’re all set</div>
                  <div className="text-gray-600 md:text-lg">
                    We’ll notify the payer that you’re ready to receive payments.
                  </div>
                  <div className="text-sm text-gray-600 max-w-xl">
                    Want to keep getting paid faster? Join the WorkLedger vendor network —
                    one profile, any company.
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 text-base rounded-xl"
                      onClick={handleVendorRegister}
                    >
                      Register as a WorkLedger Vendor
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-700 px-6 py-6 text-base rounded-xl"
                    >
                      <Mail className="mr-2 h-5 w-5" />Email me a copy
                    </Button>
                  </div>
                </div>
              </Section>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bottom navigation */}
        <div className="mt-8 flex items-center justify-between">
          {/* Back button: hidden on landing, visible otherwise */}
          {idx > 0 ? (
            <Button
              variant="ghost"
              className="text-base text-gray-600 hover:text-blue-600 border border-gray-200 px-6 py-3 rounded-xl"
              onClick={back}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {/* Continue/Finish: show on all steps except welcome & done */}
          {steps[idx].key !== "welcome" && steps[idx].key !== "done" && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-6 rounded-xl"
              onClick={() => {
                if (steps[idx].key === "review") setIdx(steps.length - 1);
                else next();
              }}
              disabled={!canContinue}
            >
              {steps[idx].key === "review" ? "Finish" : "Continue"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </main>

      <footer className="mx-auto max-w-3xl px-5 pb-12 text-xs md:text-sm text-gray-500">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center justify-between">
          <div>© {new Date().getFullYear()} WorkLedger. All rights reserved.</div>
          <div>Privacy • Terms • Security</div>
        </div>
      </footer>
    </div>
    </>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2">
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}