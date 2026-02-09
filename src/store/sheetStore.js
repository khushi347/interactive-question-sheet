import { create } from "zustand";

const useSheetStore = create((set) => ({
  topics: [],
  setTopics: (topics) => set({ topics }),

  addTopic: (title) =>
    set((state) => ({
      topics: [
        ...state.topics,
        {
          id: crypto.randomUUID(),
          title,
          subTopics: [],
        },
      ],
    })),

  deleteTopic: (topicId) =>
    set((state) => ({
      topics: state.topics.filter((t) => t.id !== topicId),
    })),

  editTopic: (topicId, newTitle) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId ? { ...t, title: newTitle } : t
      ),
    })),

  reorderTopics: (start, end) =>
    set((state) => {
      const updated = [...state.topics];
      const [moved] = updated.splice(start, 1);
      updated.splice(end, 0, moved);
      return { topics: updated };
    }),

  addSubTopic: (topicId, title) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: [
                ...t.subTopics,
                {
                  id: crypto.randomUUID(),
                  title,
                  questions: [],
                },
              ],
            }
          : t
      ),
    })),

  deleteSubTopic: (topicId, subTopicId) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.filter(
                (st) => st.id !== subTopicId
              ),
            }
          : t
      ),
    })),

  editSubTopic: (topicId, subTopicId, newTitle) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? { ...st, title: newTitle }
                  : st
              ),
            }
          : t
      ),
    })),

  reorderSubTopics: (topicId, start, end) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: (() => {
                const arr = [...t.subTopics];
                const [moved] = arr.splice(start, 1);
                arr.splice(end, 0, moved);
                return arr;
              })(),
            }
          : t
      ),
    })),

  addQuestion: (topicId, subTopicId, title) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? {
                      ...st,
                      questions: [
                        ...st.questions,
                        {
                          id: crypto.randomUUID(),
                          title,
                        },
                      ],
                    }
                  : st
              ),
            }
          : t
      ),
    })),

  deleteQuestion: (topicId, subTopicId, questionId) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? {
                      ...st,
                      questions: st.questions.filter(
                        (q) => q.id !== questionId
                      ),
                    }
                  : st
              ),
            }
          : t
      ),
    })),

  editQuestion: (topicId, subTopicId, questionId, newTitle) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? {
                      ...st,
                      questions: st.questions.map((q) =>
                        q.id === questionId
                          ? { ...q, title: newTitle }
                          : q
                      ),
                    }
                  : st
              ),
            }
          : t
      ),
    })),

  reorderQuestions: (topicId, subTopicId, start, end) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? {
                      ...st,
                      questions: (() => {
                        const arr = [...st.questions];
                        const [moved] = arr.splice(start, 1);
                        arr.splice(end, 0, moved);
                        return arr;
                      })(),
                    }
                  : st
              ),
            }
          : t
      ),
    })),
}));

export default useSheetStore;
