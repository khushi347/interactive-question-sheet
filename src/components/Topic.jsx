import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import SubTopic from "./SubTopic";

function Topic({
  topic,
  index,
  addSubTopic,
  deleteTopic,
  deleteSubTopic,
  addQuestion,
  deleteQuestion,
  editTopic,
  editSubTopic,
  editQuestion,
  subTopicInput,
  setSubTopicInput,
  questionInput,
  setQuestionInput,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(topic.title);

  const totalQuestions = topic.subTopics.reduce(
    (sum, st) => sum + st.questions.length,
    0
  );

  return (
    <Draggable draggableId={topic.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="
            mb-8
            bg-white
            border border-gray-300/90
            rounded-3xl
            px-7 py-6
            transition
            shadow-[0_2px_6px_rgba(0,0,0,0.05)]
            hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]
          "
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            {...provided.dragHandleProps}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isEditing ? (
              <input
                value={title}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  editTopic(topic.id, title);
                  setIsEditing(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editTopic(topic.id, title);
                    setIsEditing(false);
                  }
                }}
                className="
                  w-full mr-4
                  px-4 py-2.5
                  text-base
                  border border-gray-300/90
                  rounded-lg
                  focus:outline-none
                  focus:ring-2 focus:ring-orange-400/60
                "
              />
            ) : (
              <h2
                className="text-lg font-semibold text-gray-900"
                onDoubleClick={() => setIsEditing(true)}
              >
                {topic.title}
              </h2>
            )}

            <div className="flex items-center gap-6">
              <span className="text-xs font-medium text-gray-500">
                {totalQuestions} questions
              </span>
              <span className="text-gray-400 text-lg select-none">
                {isOpen ? "▾" : "▸"}
              </span>
            </div>
          </div>

          <div className="w-full h-2 bg-orange-100 rounded-full mt-4">
            <div
              className="h-2 bg-orange-500 rounded-full transition-all"
              style={{ width: "40%" }}
            />
          </div>

          {isOpen && (
            <div className="mt-7">
              <div className="flex gap-3 mb-6">
                <input
                  value={subTopicInput[topic.id] || ""}
                  onChange={(e) =>
                    setSubTopicInput({
                      ...subTopicInput,
                      [topic.id]: e.target.value,
                    })
                  }
                  placeholder="Add sub-topic"
                  className="
                    flex-1
                    px-4 py-2.5
                    text-[15px]
                    border border-gray-300/90
                    rounded-lg
                    focus:outline-none
                    focus:ring-2 focus:ring-orange-400/60
                  "
                />
                <button
                  onClick={() => {
                    if (!subTopicInput[topic.id]?.trim()) return;
                    addSubTopic(
                      topic.id,
                      subTopicInput[topic.id]
                    );
                    setSubTopicInput({
                      ...subTopicInput,
                      [topic.id]: "",
                    });
                  }}
                  className="
                    px-5
                    bg-gray-900 text-white
                    rounded-lg
                    text-sm font-medium
                    shadow-sm
                    hover:bg-gray-800 hover:shadow-md
                    transition
                  "
                >
                  Add
                </button>
              </div>

              <Droppable droppableId={topic.id} type="SUBTOPIC">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-5"
                  >
                    {topic.subTopics.map((st, stIndex) => (
                      <Draggable
                        key={st.id}
                        draggableId={st.id}
                        index={stIndex}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <SubTopic
                              topicId={topic.id}
                              subTopic={st}
                              deleteSubTopic={deleteSubTopic}
                              addQuestion={addQuestion}
                              deleteQuestion={deleteQuestion}
                              editSubTopic={editSubTopic}
                              editQuestion={editQuestion}
                              questionInput={questionInput}
                              setQuestionInput={setQuestionInput}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button
                onClick={() => deleteTopic(topic.id)}
                className="
                  mt-7
                  text-sm font-medium
                  text-red-500
                  hover:text-red-600
                  transition
                "
              >
                Delete topic
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default Topic;
