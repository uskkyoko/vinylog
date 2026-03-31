/**
 * Settings page — owns the page shell and guards auth.
 *
 * Data flow: useAuth() reads the current user from AuthContext.
 * Passes user down to SettingsForm, which owns all form state and
 * submission logic. Uses FormPageShell so the shell is declared here
 * (at page level), keeping SettingsForm focused on form concerns only.
 */
import "./Settings.css";
import { FormPageShell } from "../../components/FormPageShell";
import { useAuth } from "../../context/useAuth";
import { SettingsForm } from "./SettingsForm";

export default function Settings() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <FormPageShell eyebrow="Personalize" title="User Profile">
      <SettingsForm user={user} />
    </FormPageShell>
  );
}
