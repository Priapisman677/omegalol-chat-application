import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="h-full bg-[#101011] text-white px-4 py-16 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Privacy & Usage Notice</h1>

      <p>
        This chat application is in an early development and testing phase. It is not intended for production use,
        and no guarantees are made regarding uptime, data retention, or message security.
      </p>

      <p>
        Messages are not end-to-end encrypted. While efforts are made to maintain reasonable security, users should not share sensitive, personal, or confidential information through this app.
      </p>

      <p>
        No personal information is required to sign up. Emails are not verified and are only used for identification purposes during testing. No marketing or third-party tracking is used.
      </p>

      <p>
        Logs may be collected temporarily for debugging and performance analysis but are not stored permanently or shared.
      </p>

      <p>
        By using this application, you agree that you are doing so at your own discretion and that the developer is not responsible for any misuse, data loss, or harm resulting from the use of this tool.
      </p>

      <p>
        If you have questions or concerns, please <Link href="/contact" className="underline hover:text-gray-300">contact me</Link>.
      </p>
    </div>
  );
}