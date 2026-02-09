import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Question from "./Question";

function SubTopic({
  topicId,
  subTopic,
  deleteSubTopic,
  addQuestion,
  deleteQuestion,
  editSubTopic,
  editQuestion,
  questionInput,
  setQuestionInput,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(subTopic.title);

  return (
    <div
      className="
        mb-6
        bg-white
        border border-gray-300/90
        rounded-2xl
        transition
        shadow-[0_1px_2px_rgba(0,0,0,0.04)]
        hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)]
      "
    >
      <div
        className="
          flex justify-between items-center
          px-6 py-4
          cursor-pointer
          rounded-2xl
          hover:bg-gray-50/70
          transition
        "
        onClick={() => setIsOpen(!isOpen)}
      >
        {isEditing ? (
          <input
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              editSubTopic(topicId, subTopic.id, title);
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editSubTopic(topicId, subTopic.id, title);
                setIsEditing(false);
              }
            }}
            className="
              w-full mr-4
              px-4 py-2.5
              text-[15px]
              border border-gray-300/90
              rounded-lg
              focus:outline-none
              focus:ring-2 focus:ring-orange-400/60
            "
          />
        ) : (
          <div
            className="text-[15px] font-semibold text-gray-900"
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {subTopic.title}
          </div>
        )}

        <div className="flex items-center gap-5">
          <span className="text-xs font-medium text-gray-500">
            {subTopic.questions.length} questions
          </span>
          <span className="text-gray-400 text-lg select-none">
            {isOpen ? "▾" : "▸"}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="px-7 pb-6">
          <div className="flex gap-3 mb-5">
            <input
              value={questionInput[subTopic.id] || ""}
              onChange={(e) =>
                setQuestionInput({
                  ...questionInput,
                  [subTopic.id]: e.target.value,
                })
              }
              placeholder="Add a question"
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
                if (!questionInput[subTopic.id]?.trim()) return;
                addQuestion(
                  topicId,
                  subTopic.id,
                  questionInput[subTopic.id]
                );
                setQuestionInput({
                  ...questionInput,
                  [subTopic.id]: "",
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

          <Droppable
            droppableId={`${topicId}|${subTopic.id}`}
            type="QUESTION"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3"
              >
                {subTopic.questions.map((q, index) => (
                  <Draggable
                    key={q.id}
                    draggableId={q.id}
                    index={index}
                  >
                    {(provided) => (
                      <Question
                        question={q}
                        dragProps={provided}
                        onDelete={() =>
                          deleteQuestion(
                            topicId,
                            subTopic.id,
                            q.id
                          )
                        }
                        onEdit={(t) =>
                          editQuestion(
                            topicId,
                            subTopic.id,
                            q.id,
                            t
                          )
                        }
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <button
            onClick={() =>
              deleteSubTopic(topicId, subTopic.id)
            }
            className="
              mt-5
              text-xs font-medium
              text-red-500
              hover:text-red-600
              transition
            "
          >
            Delete sub-topic
          </button>
        </div>
      )}
    </div>
  );
}

export default SubTopic;
