import React, { useEffect, useRef, useState } from "react";
import {
  __experimentalInputControl as InputControl,
  Button,
} from "@wordpress/components";

export function InputLink(props) {
  const { onChange, value } = props;
  const [showInput, setShowInput] = useState(false);
  return (
    <div className="admin-input-link">
      <div className="admin-input-btn">
        <Button
          className="admin-buttom-link-item"
          onClick={() => setShowInput(!showInput)}
        >
          <span class="dashicons dashicons-admin-links"></span>
        </Button>
      </div>
      {showInput ? (
        <div className="admin-input-inpt">
          <InputControl value={value} onChange={(value) => onChange(value)} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
