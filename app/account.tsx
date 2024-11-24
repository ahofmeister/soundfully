import {createClient} from "@/utils/supabase/server";

export async function Account() {
    const supabase = createClient()

    const {data: {user}} = await supabase.auth.getUser()

    return <div>{user?.email}</div> ;
}