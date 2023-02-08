import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import {
  PanelBody,
  __experimentalInputControl as InputControl,
} from "@wordpress/components";
import { Fragment, useState, useEffect } from "@wordpress/element";
import { ConfigBlock } from "../../components/config-block";
import { ALLOWED_FORMATS } from "../../config/define";
import { ImageUploadSingle } from "../../components/image-upload";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

const Control = function ({ props }) {
  const { attributes, setAttributes } = props;

  return (
    <>
      <InspectorControls key="settting">
        <PanelBody title="Cấu hình chung" initialOpen={true}>
          <div className="mb-3">
            <InputControl
              value={attributes.title_shadow}
              onChange={(value) => setAttributes({ title_shadow: value })}
              placeholder="Nhập tiêu đề chìm"
              label="Tiêu đề chìm"
            />
          </div>
          <div className="mb-3">
            <InputControl
              value={attributes.modal_meeting.title_modal}
              onChange={(value) => {
                const newModal = { ...attributes.modal_meeting };
                newModal["title_modal"] = value;
                setAttributes({ modal_meeting: newModal });
              }}
              placeholder="Nhập tiêu đề modal"
              label="Title Modal Meeting"
            />
          </div>
          <div className="mb-3">
            <InputControl
              value={attributes.modal_meeting.link}
              onChange={(value) => {
                const newModal = { ...attributes.modal_meeting };
                newModal["link"] = value;
                setAttributes({ modal_meeting: newModal });
              }}
              placeholder="Nhập link meeting"
              label="Link Meeting"
            />
          </div>
        </PanelBody>
        <PanelBody title="Cấu hình block" initialOpen={true}>
          <ConfigBlock data={attributes} setData={setAttributes} />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

const DragHandle = sortableHandle(() => (
  <span className="admin-buttom-move-item">
    <span class="dashicons dashicons-move"></span>
  </span>
));

const active_style = {
  background: '#01B9EA',
}

const SortableItem = SortableElement((props) => {
  const { object, expanded, setExpanded, data_key, attributes, setAttributes, handlerDelete } = props;

  return (
    <li className="item" key={data_key}>
      <div
        className="ttl"
        style={expanded === data_key ? active_style : {}}
        onClick={() => setExpanded(data_key)}
      >
        <RichText
          tagName="span"
          className=""
          value={object.title}
          allowedFormats={ALLOWED_FORMATS}
          placeholder="Enter Title"
          keepPlaceholderOnFocus={true}
          onChange={(value) => {
            let newWhys = [...attributes?.whys];
            let newObj = { ...object, title: value };
            newWhys[data_key] = newObj;
            setAttributes({ whys: newWhys });
          }}
        />
        <DragHandle/>
        <button
          onClick={(event) => handlerDelete(event, data_key)}
          className="admin-buttom-delete-item"
        >
          <span class="dashicons dashicons-no"></span>
        </button>
      </div>
      {expanded === data_key ? (
        <RichText
          tagName="span"
          className="txt show"
          value={object.text}
          allowedFormats={ALLOWED_FORMATS}
          placeholder="Text"
          keepPlaceholderOnFocus={true}
          onChange={(value) => {
            let newWhys = [...attributes?.whys];
            let newObj = { ...object, text: value };
            newWhys[data_key] = newObj;
            setAttributes({ whys: newWhys });
          }}
        />
      ) : <span/>}
    </li>
  );
});

const SortableList = SortableContainer((props) => {
  const { items, attributes, setAttributes, handlerAdd, handlerDelete } = props;
  const [expanded, setExpanded] = useState(0);

  return (
    <ul className="list">
      {items.length > 0 &&
        items.map(function (object, index) {
          return (
            <SortableItem
              key={`item-${index}`}
              value={object}
              object={object}
              index={index}
              data_key={index}
              attributes={attributes}
              setAttributes={setAttributes}
              handlerDelete={handlerDelete}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          );
        })}
      <li className="item">
        <button class="admin-buttom-add-item" onClick={handlerAdd}>
          <span class="dashicons dashicons-plus-alt2"></span>
        </button>
      </li>
    </ul>
  );
});

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  const {
    title,
    title_shadow,
    image,
    whys,
    text_meeting,
    text_button_meeting,
  } = attributes;

  const handlerDelete = (event, index) => {
    event.stopPropagation();
    let newWhys = [...whys];
    newWhys.splice(index, 1);
    setAttributes({ whys: newWhys });
  };

  const handlerAdd = () => {
    let newWhys = [...whys];
    newWhys.push({ title: "Title", text: "Content" });
    setAttributes({ whys: newWhys });
  };

  const handlerOnSortEnd = ({ oldIndex, newIndex }) => {
    let newWhys = [...whys];
    setAttributes({
      whys: arrayMoveImmutable(newWhys, oldIndex, newIndex),
    });
  };

  return (
    <Fragment>
      <div className="block block-outsource">
        <div className="holder outsource-inner">
          <div className="wrap">
            <ImageUploadSingle
              value={image}
              className="img"
              onChange={(value) => {
                if (!value) return false;
                setAttributes({
                  image: value,
                });
              }}
            />
            <div className="content">
              <div className="title">
                <RichText
                  tagName="h3"
                  className="ttl"
                  value={title}
                  allowedFormats={ALLOWED_FORMATS}
                  placeholder="description"
                  keepPlaceholderOnFocus={true}
                  onChange={(value) => setAttributes({ title: value })}
                />
                <span className="shadow shadow--primary">{title_shadow}</span>
              </div>
              <SortableList
                items={whys}
                onSortEnd={handlerOnSortEnd}
                axis="y"
                helperClass="hold-item-outsource"
                hideSortableGhost={true}
                lockOffset={["100%"]}
                useDragHandle
                attributes={attributes}
                setAttributes={setAttributes}
                handlerAdd={handlerAdd}
                handlerDelete={handlerDelete}
              />
            </div>
          </div>
          <div className="call-meeting">
            <div className="meeting-wrap">
              <RichText
                tagName="div"
                className="txt"
                value={text_meeting}
                allowedFormats={ALLOWED_FORMATS}
                placeholder="description"
                keepPlaceholderOnFocus={true}
                onChange={(value) => setAttributes({ text_meeting: value })}
              />
              <RichText
                tagName="div"
                className="btn"
                value={text_button_meeting}
                allowedFormats={ALLOWED_FORMATS}
                placeholder="description"
                keepPlaceholderOnFocus={true}
                onChange={(value) =>
                  setAttributes({ text_button_meeting: value })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default function Edit(props) {
  return (
    <div {...useBlockProps()}>
      <Control props={props}></Control>
      <FragmentBlock props={props}></FragmentBlock>
    </div>
  );
}
