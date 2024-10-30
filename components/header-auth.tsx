import {createClient} from "@/utils/supabase/server";

export default async function AuthButton() {
    const {
        data: {user},
    } = await createClient().auth.getUser();

    return (
        <>
        </>)
}
