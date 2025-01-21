import { getCurrentProfile } from "@/lib/db/profiles";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  
  if (!profile) {
    return <div>ログインしてください</div>;
  }

  return (
    <div>
      <h1>プロフィール</h1>
      <p>名前: {profile.full_name}</p>
      <p>メール: {profile.email}</p>
    </div>
  );
} 