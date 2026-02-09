import { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import useSheetStore from "./store/sheetStore";
import { fetchSheet } from "./services/api";
import Topic from "./components/Topic";

function App() {
  const [topicInput, setTopicInput] = useState("");
  const topics = useSheetStore((s) => s.topics);
  const setTopics = useSheetStore((s) => s.setTopics);

  const addTopic = useSheetStore((s) => s.addTopic);
  const reorderTopics = useSheetStore((s) => s.reorderTopics);
  const reorderSubTopics = useSheetStore((s) => s.reorderSubTopics);
  const reorderQuestions = useSheetStore((s) => s.reorderQuestions);

  const addSubTopic = useSheetStore((s) => s.addSubTopic);
  const deleteTopic = useSheetStore((s) => s.deleteTopic);
  const deleteSubTopic = useSheetStore((s) => s.deleteSubTopic);
  const addQuestion = useSheetStore((s) => s.addQuestion);
  const deleteQuestion = useSheetStore((s) => s.deleteQuestion);

  const editTopic = useSheetStore((s) => s.editTopic);
  const editSubTopic = useSheetStore((s) => s.editSubTopic);
  const editQuestion = useSheetStore((s) => s.editQuestion);

  const [subTopicInput, setSubTopicInput] = useState({});
  const [questionInput, setQuestionInput] = useState({});

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchSheet().then((res) => {
      const topicMap = {};

      res.data.questions.forEach((q) => {
        const topicTitle = q.topic || "Others";
        const subTopicTitle =
          q.questionId?.difficulty ||
          q.questionId?.level ||
          "Uncategorized";

        if (!topicMap[topicTitle]) {
          topicMap[topicTitle] = {
            id: crypto.randomUUID(),
            title: topicTitle,
            subTopics: {},
          };
        }

        if (!topicMap[topicTitle].subTopics[subTopicTitle]) {
          topicMap[topicTitle].subTopics[subTopicTitle] = {
            id: crypto.randomUUID(),
            title: subTopicTitle,
            questions: [],
          };
        }

        topicMap[topicTitle].subTopics[subTopicTitle].questions.push({
          id: crypto.randomUUID(),
          title: q.title,
        });
      });

      const normalized = Object.values(topicMap).map((t) => ({
        ...t,
        subTopics: Object.values(t.subTopics),
      }));

      setTopics(normalized);
    });
  }, [setTopics]);

  const onDragEnd = ({ source, destination, type }) => {
    if (!destination) return;

    if (type === "TOPIC") {
      reorderTopics(source.index, destination.index);
    }

    if (type === "SUBTOPIC") {
      reorderSubTopics(
        source.droppableId,
        source.index,
        destination.index
      );
    }

    if (type === "QUESTION") {
      const [topicId, subTopicId] =
        source.droppableId.split("|");

      reorderQuestions(
        topicId,
        subTopicId,
        source.index,
        destination.index
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            DSA Question Sheet
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Track, organize, and revise questions topic-wise
          </p>
        </div>
        <div className="mb-10">
          <div className="flex gap-3">
            <input
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && topicInput.trim()) {
                  addTopic(topicInput);
                  setTopicInput("");
                }
              }}
              placeholder="Add new topic"
              className="
                          flex-1
                          px-4 py-2.5
                          text-[15px]
                          bg-white
                          border border-gray-300/90
                          rounded-lg
                          shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]
                          focus:outline-none
                          focus:ring-2 focus:ring-orange-400/60
                          focus:border-orange-400/60
                          transition
                            " />

            <button
              onClick={() => {
                if (!topicInput.trim()) return;
                addTopic(topicInput);
                setTopicInput("");
              }}
              disabled={!topicInput.trim()}
              className="
        px-5 py-2.5
        bg-white
        text-gray-900
        border border-gray-300/90
        rounded-lg
        text-sm font-medium
        shadow-[0_1px_2px_rgba(0,0,0,0.04)]
        hover:bg-gray-50
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
            >
              <span className="flex items-center gap-2 font-semibold">
                <span className="text-lg leading-none">+</span>
                Add Topic
              </span>

            </button>
          </div>
        </div>

        <div
          className="
            bg-white
            border border-gray-300/80
            rounded-3xl
            px-7 py-7
            shadow-[0_10px_40px_rgba(0,0,0,0.06)]
          "
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="topics" type="TOPIC">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-8"
                >
                  {topics.map((topic, index) => (
                    <Topic
                      key={topic.id}
                      topic={topic}
                      index={index}
                      addSubTopic={addSubTopic}
                      deleteTopic={deleteTopic}
                      deleteSubTopic={deleteSubTopic}
                      addQuestion={addQuestion}
                      deleteQuestion={deleteQuestion}
                      editTopic={editTopic}
                      editSubTopic={editSubTopic}
                      editQuestion={editQuestion}
                      subTopicInput={subTopicInput}
                      setSubTopicInput={setSubTopicInput}
                      questionInput={questionInput}
                      setQuestionInput={setQuestionInput}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;
