import { whatsappLink } from "@/components/whatsapp-button";
import { useState, type FormEvent } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const fieldClass = "mt-2 h-11 rounded-xl border-border/15 bg-surface/70";

const WEBSITE_TYPES = [
  "Business website",
  "Restaurant/Cafe",
  "Cloud Kitchen",
  "Gym/Fitness",
  "E-commerce",
  "Landing Page",
  "WordPress",
  "Other",
];

const BUDGETS = [
  "Below ₹5,000",
  "₹5,000–₹10,000",
  "₹10,000–₹20,000",
  "₹20,000+",
  "Not sure",
];

const CURRENT = ["Yes", "No", "Old/outdated website"];

const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  business_name: z.string().trim().min(2, "Please enter your business name").max(160),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, "Enter a valid WhatsApp number"),
  email: z.union([
    z.literal(""),
    z.string().trim().email("Enter a valid email").max(255),
  ]),
  city: z.string().trim().max(100),
  business_type: z
    .string()
    .trim()
    .min(2, "Please enter your business category")
    .max(100),
  current_website: z.enum(CURRENT as [string, ...string[]], {
    message: "Choose an option",
  }),
  website_type: z.enum(WEBSITE_TYPES as [string, ...string[]], {
    message: "Choose a website type",
  }),
  pages_required: z.string().trim().max(40),
  project_details: z
    .string()
    .trim()
    .min(10, "Please describe your requirements (at least 10 characters)")
    .max(3000),
  budget: z.string().max(40),
  lead_source: z.string().trim().max(200),
});

export function WebsiteRequestForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [errors, setErrors] = useState<
    Partial<Record<keyof z.infer<typeof leadSchema>, string>>
  >({});
  const [startedAt] = useState(() => Date.now());

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const el = event.currentTarget;
    const form = new FormData(el);

    // Spam protection: hidden honeypot field and minimum fill time.
    if (
      String(form.get("company_website") || "") ||
      Date.now() - startedAt < 3000
    ) {
      setStatus("sent");
      return;
    }

    const raw = Object.fromEntries(
      [
        "name",
        "business_name",
        "phone",
        "email",
        "city",
        "business_type",
        "current_website",
        "website_type",
        "pages_required",
        "project_details",
        "budget",
        "lead_source",
      ].map((key) => [key, String(form.get(key) ?? "")]),
    );

    const parsed = leadSchema.safeParse(raw);

    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [
            String(issue.path[0]),
            issue.message,
          ]),
        ),
      );
      return;
    }

    setErrors({});

    const d = parsed.data;

    const message = [
      "Hi Hemasri, I would like to request a website.",
      "",
      `Name: ${d.name}`,
      `Business: ${d.business_name}`,
      `WhatsApp: ${d.phone}`,
      d.email ? `Email: ${d.email}` : "",
      d.city ? `City: ${d.city}` : "",
      `Business category: ${d.business_type}`,
      `Current website: ${d.current_website}`,
      `Website type: ${d.website_type}`,
      d.pages_required ? `Pages required: ${d.pages_required}` : "",
      d.budget ? `Budget: ${d.budget}` : "",
      "",
      `Requirements: ${d.project_details}`,
      d.lead_source ? `Found First Step Future through: ${d.lead_source}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = whatsappLink(message);

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setStatus("sent");
    el.reset();
  }

  if (status === "sent") {
    return (
      <div className="glass-card text-center">
        <CheckCircle2 className="mx-auto size-9 text-primary" />

        <p className="mt-4 font-display text-xl font-bold">
          Your enquiry is ready!
        </p>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          WhatsApp has been opened with your website requirements. Send the
          message to complete your enquiry.
        </p>

        <Button asChild size="lg" className="mt-6 rounded-xl">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="size-4" />
            Chat on WhatsApp
          </a>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="glass-card grid gap-5 p-6 md:grid-cols-2 md:p-8"
    >
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Leave empty
          <input
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <Field
        label="Full name"
        name="name"
        required
        error={errors.name}
      />

      <Field
        label="Business name"
        name="business_name"
        required
        error={errors.business_name}
      />

      <Field
        label="WhatsApp number"
        name="phone"
        type="tel"
        required
        placeholder="+91 98765 43210"
        error={errors.phone}
      />

      <Field
        label="Email (optional)"
        name="email"
        type="email"
        error={errors.email}
      />

      <Field
        label="City (optional)"
        name="city"
        error={errors.city}
      />

      <Field
        label="Business category"
        name="business_type"
        placeholder="Cafe, salon, construction..."
        required
        error={errors.business_type}
      />

      <SelectField
        label="Do you currently have a website?"
        name="current_website"
        options={CURRENT}
        required
        error={errors.current_website}
      />

      <SelectField
        label="Website type"
        name="website_type"
        options={WEBSITE_TYPES}
        required
        error={errors.website_type}
      />

      <Field
        label="Number of pages required (optional)"
        name="pages_required"
        placeholder="e.g. 5"
        error={errors.pages_required}
      />

      <SelectField
        label="Estimated budget (optional)"
        name="budget"
        options={BUDGETS}
        error={errors.budget}
      />

      <div className="md:col-span-2">
        <Label htmlFor="project_details">Website requirements</Label>

        <Textarea
          id="project_details"
          name="project_details"
          maxLength={3000}
          required
          className="mt-2 min-h-32 rounded-xl border-border/15 bg-surface/70"
          placeholder="Tell me about your business, the pages you need, and your preferred timeline."
        />

        {errors.project_details && (
          <p className="mt-1 text-xs text-destructive">
            {errors.project_details}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <Field
          label="How did you find First Step Future? (optional)"
          name="lead_source"
          placeholder="Instagram, Google, a friend..."
          error={errors.lead_source}
        />
      </div>

      <div className="md:col-span-2">
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-xl sm:w-auto"
        >
          Request My Website
        </Button>

        <p className="mt-3 text-xs text-muted-foreground">
          Submitting opens WhatsApp with your enquiry. It does not commit you
          to a purchase.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>

      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={fieldClass}
        aria-invalid={!!error}
      />

      {error && (
        <p className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  required,
  error,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>

      <select
        id={name}
        name={name}
        defaultValue=""
        required={required}
        aria-invalid={!!error}
        className={`${fieldClass} w-full border px-3 text-sm`}
      >
        <option value="" disabled={required}>
          {required ? "Choose one" : "Not specified"}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}