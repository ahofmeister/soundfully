import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import Upload from "@/app/upload/upload";

export default async function UploadPage() {
    const supabase = createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
            <div className="w-full flex">
                <Upload/>
        </div>
    );
}
