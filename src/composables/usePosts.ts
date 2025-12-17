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
   카테고리 정규화
   - DB에 예전 값(free/notice/qna 등)이 섞여 있어도
     화면/저장은 항상 "자유/공지/QnA"로 통일
====================== */
export const CATEGORY_LABELS = ["자유", "공지", "QnA"] as const;
export type CategoryLabel = (typeof CATEGORY_LABELS)[number];

function normalizeCategory(raw: unknown): CategoryLabel {
    const v = String(raw ?? "").trim();

    // 이미 새 라벨이면 그대로
    if (v === "자유" || v === "공지" || v === "QnA") return v;

    // 예전/다른 표기들 매핑
    const lower = v.toLowerCase();
    if (lower === "free" || lower === "자유글") return "자유";
    if (lower === "notice" || lower === "공지사항") return "공지";
    if (lower === "qna" || lower === "qa" || lower === "q&a") return "QnA";

    // 비어있거나 알 수 없는 값이면 기본값
    return "자유";
}

/* ======================
   Post 타입 정의
====================== */
export type Post = {
    id: string;
    title: string;
    content: string;
    category: CategoryLabel; // ✅ 항상 라벨로 통일
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

        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

        return onSnapshot(q, (snapshot) => {
            posts.value = snapshot.docs.map((d) => {
                const data = d.data() as any;

                return {
                    id: d.id,
                    title: String(data.title ?? ""),
                    content: String(data.content ?? ""),
                    category: normalizeCategory(data.category),
                    authorId: String(data.authorId ?? ""),
                    authorName: String(data.authorName ?? ""),
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                };
            });

            postsLoading.value = false;
        });
    }

    /* 🔹 게시글 단건 조회 */
    async function getPostById(id: string): Promise<Post | null> {
        const snap = await getDoc(doc(db, "posts", id));
        if (!snap.exists()) return null;

        const data = snap.data() as any;
        return {
            id: snap.id,
            title: String(data.title ?? ""),
            content: String(data.content ?? ""),
            category: normalizeCategory(data.category),
            authorId: String(data.authorId ?? ""),
            authorName: String(data.authorName ?? ""),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    /* 🔹 게시글 생성 */
    async function createPost(input: {
        title: string;
        content: string;
        category: string; // 들어오는 값이 뭐든 정규화해서 저장
        authorId: string;
        authorName: string;
    }) {
        const title = input.title.trim();
        const content = input.content.trim();
        const category = normalizeCategory(input.category);

        await addDoc(collection(db, "posts"), {
            title,
            content,
            category, // ✅ 항상 "자유/공지/QnA"
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
        const payload: Record<string, any> = {
            title: input.title.trim(),
            content: input.content.trim(),
            updatedAt: serverTimestamp(),
        };

        if (typeof input.category === "string") {
            payload.category = normalizeCategory(input.category);
        }

        await updateDoc(doc(db, "posts", id), payload);
    }

    /* 🔹 게시글 삭제 */
    async function removePost(id: string) {
        await deleteDoc(doc(db, "posts", id));
    }

    /* ======================
       외부 노출
    ====================== */
    return {
        list: computed(() => posts.value),
        postsLoading,
        subscribePosts,
        getPostById,
        createPost,
        updatePost,
        removePost,
    };
}
