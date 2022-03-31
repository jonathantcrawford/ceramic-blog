
import { useUser } from "~/utils";


export default function AccountPage() {
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col p-8">
      <div className="text-white-100 text-2xl font-saygon">{user.email}</div>
    </div>
  );
}
