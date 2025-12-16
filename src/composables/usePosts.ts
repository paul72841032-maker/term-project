import { ref, computed } from "vue";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
} from "firebase/firestore";
import { db, serverTimestamp } from "../firebase";

/* ======================
   Post 타입 정의
====================== */
export type Post = {
    id: string;
    title: string;
    content: string;
    category: string;      // ✅ 카테고리
    authorId: string;
    authorName: string;
    createdAt?: any;
    updatedAt?: any;
};

/* ======================
   상태
====================== */
const posts = ref<Post[]>([]);
const postsLoading = ref(true);

/* ======================
   Composable
====================== */
export function usePosts() {
    /* 🔹 게시글 실시간 구독 */
    function subscribePosts() {
        postsLoading.value = true;

        const q = query(
            collection(db, "posts"),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            posts.value = snapshot.docs.map(
                (d) => ({
                    id: d.id,
                    ...(d.data() as Omit<Post, "id">),
                })
            );
            postsLoading.value = false;
        });
    }

    /* 🔹 게시글 단건 조회 */
    async function getPostById(id: string): Promise<Post | null> {
        const snap = await getDoc(doc(db, "posts", id));
        if (!snap.exists()) return null;

        return {
            id: snap.id,
            ...(snap.data() as Omit<Post, "id">),
        };
    }

    /* 🔹 게시글 생성 */
    async function createPost(input: {
        title: string;
        content: string;
        category: string;     // ✅ 반드시 포함
        authorId: string;
        authorName: string;
    }) {
        await addDoc(collection(db, "posts"), {
            title: input.title.trim(),
            content: input.content.trim(),
            category: input.category,
            authorId: input.authorId,
            authorName: input.authorName,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    }

    /* 🔹 게시글 수정 */
    async function updatePost(
        id: string,
        input: {
            title: string;
            content: string;
            category?: string;
        }
    ) {
        await updateDoc(doc(db, "posts", id), {
            title: input.title.trim(),
            content: input.content.trim(),
            ...(input.category && { category: input.category }),
            updatedAt: serverTimestamp(),
        });
    }

    /* 🔹 게시글 삭제 */
    async function removePost(id: string) {
        await deleteDoc(doc(db, "posts", id));
    }

    /* ======================
       외부 노출
    ====================== */
    return {
        list: computed(() => posts.value),  // ✅ HomePage에서 사용
        postsLoading,
        subscribePosts,
        getPostById,
        createPost,
        updatePost,
        removePost,
    };
}
