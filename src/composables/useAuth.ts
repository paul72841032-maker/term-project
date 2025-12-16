import { ref, onMounted, onUnmounted } from "vue";
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    type User,
} from "firebase/auth";
import { auth } from "../firebase";

const user = ref<User | null>(null);
const loading = ref(true);

export function useAuth() {
    let unsubscribe: (() => void) | null = null;

    onMounted(() => {
        unsubscribe = onAuthStateChanged(auth, (u) => {
            user.value = u;
            loading.value = false;
        });
    });

    onUnmounted(() => {
        if (unsubscribe) unsubscribe();
    });

    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    }

    async function logout() {
        await signOut(auth);
    }

    return { user, loading, loginWithGoogle, logout };
}
