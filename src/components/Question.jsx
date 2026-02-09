import { useState } from "react";

function Question({ question, onDelete, onEdit, dragProps }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(question.title);

  return (
    <div
      ref={dragProps?.innerRef}
      {...dragProps?.draggableProps}
      {...dragProps?.dragHandleProps}
      className="
        group flex items-start justify-between
        px-5 py-3 mb-3
        bg-white
        border border-gray-300/90
        rounded-xl
        cursor-grab
        transition-all duration-200
        shadow-[0_1px_2px_rgba(0,0,0,0.05)]
        hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)]
        hover:border-gray-400/90
      "
    >
      {isEditing ? (
        <input
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            onEdit(title);
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onEdit(title);
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
          className="flex items-start gap-3 text-[15px] text-gray-800 leading-relaxed"
          onDoubleClick={() => setIsEditing(true)}
        >
          <span className="mt-2 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
          <span className="select-none">{question.title}</span>
        </div>
      )}

      <button
        onClick={onDelete}
        className="
          ml-4
          px-3 py-1.5
          text-xs font-medium
          text-red-500
          border border-transparent
          rounded-md
          opacity-0 group-hover:opacity-100
          hover:border-red-300
          hover:bg-red-50
          transition
        "
      >
        Delete
      </button>
    </div>
  );
}

export default Question;
