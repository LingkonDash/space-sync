/* 
ok first lets make the profile updating page. here is the server side page that will be server side rendering and you will make a client side Profile.tsx there a user will se a responsive view of his profile under dashboard layout. and user can update theire profile info bia betterauth. maintain the ui with colors i have given you; an dmake a responsive profile page with updating funcitonalites. and for image update you can use the imgbb function; 
it will take the file and give you img url
*/

import { getUserSession } from "@/lib/core/session"
import uploadToImgBB from "@/utils/imgbb/uploadToImgBB";


async function ProfilePage() {
    const user = getUserSession(); // it will give you session?.user data or null.
    const imgURL = uploadToImgBB(file);
    return (
        <h1>
            hi from dashboard profile
        </h1>
    )
}

export default ProfilePage