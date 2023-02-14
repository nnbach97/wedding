import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import { Fragment, useState } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../config/define";
import { ConfigBlock } from "../../components/config-block";
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
        <PanelBody title="Cấu hình chung" initialOpen={true}></PanelBody>
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

const SortableItem = SortableElement((props) => {
  const {
    object,
    data_key,
    attributes,
    setAttributes,
    handleDelete,
    setIsShowTooltip,
    isShowTooltip,
  } = props;
  return (
    <li className="item" key={data_key}>
      <button
        className="admin-buttom-delete-item"
        onClick={() => handleDelete(data_key)}
      >
        <span class="dashicons dashicons-no"></span>
      </button>
      <DragHandle />
      <span
        class="dashicons dashicons-admin-comments icon-show-popover"
        onClick={() =>
          isShowTooltip === data_key
            ? setIsShowTooltip(null)
            : setIsShowTooltip(data_key)
        }
      ></span>
      <div className="img-wrap">
        <ImageUploadSingle
          value={object.icon}
          className="img"
          onChange={(value) => {
            if (!value) return false;
            const newContent = [...attributes.content];
            newContent[data_key].icon = value;

            setAttributes({ content: newContent });
          }}
        />
      </div>
      <RichText
        tagName="span"
        className="txt"
        value={object.title}
        allowedFormats={ALLOWED_FORMATS}
        placeholder="Enter Title"
        keepPlaceholderOnFocus={true}
        onChange={(value) => {
          const newContent = [...attributes.content];
          newContent[data_key].title = value;

          setAttributes({ content: newContent });
        }}
      />
      {isShowTooltip === data_key ? (
        <div className="popover show">
          <button
            className="admin-buttom-delete-item"
            onClick={() => setIsShowTooltip(null)}
          >
            <span class="dashicons dashicons-no"></span>
          </button>
          <div className="arrow-tooltip"></div>
          <div class="popover-body">
            <RichText
              tagName="div"
              className="ttl"
              value={attributes.content[data_key]?.tooltip?.title}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="Enter Title"
              keepPlaceholderOnFocus={true}
              onChange={(value) => {
                const newContent = [...attributes.content];
                newContent[data_key].tooltip.title = value;
                setAttributes({ content: newContent });
              }}
            />

            <div class="list">
              <RichText
                tagName="ul"
                className=""
                value={attributes.content[data_key]?.tooltip?.lists}
                allowedFormats={ALLOWED_FORMATS}
                placeholder="List"
                keepPlaceholderOnFocus={true}
                onChange={(value) => {
                  const newContent = [...attributes.content];
                  newContent[data_key].tooltip.lists = value;
                  setAttributes({ content: newContent });
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </li>
  );
});

const SortableList = SortableContainer((props) => {
  const {
    items,
    attributes,
    setAttributes,
    handleDelete,
    handleAdd,
    isShowTooltip,
    setIsShowTooltip,
  } = props;

  return (
    <ul className="content-solution">
      {items &&
        items.map((object, index) => {
          return (
            <SortableItem
              key={`item-${index}`}
              value={object}
              object={object}
              index={index}
              data_key={index}
              attributes={attributes}
              setAttributes={setAttributes}
              handleDelete={handleDelete}
              isShowTooltip={isShowTooltip}
              setIsShowTooltip={setIsShowTooltip}
            />
          );
        })}
      <li className="item">
        <button className="admin-buttom-add-item" onClick={handleAdd}>
          <span class="dashicons dashicons-plus-alt2"></span>
        </button>
      </li>
    </ul>
  );
});

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;
  const [isShowTooltip, setIsShowTooltip] = useState(null);

  const handleDelete = (index) => {
    let atts = [...attributes?.content];
    atts.splice(index, 1);
    setAttributes({ content: atts });
  };

  const handleAdd = () => {
    let atts = [...attributes?.content];
    atts.push({
      title: "<strong>Text</strong>",
      icon: {
        url: "",
        alt: "",
        id: "",
      },
      tooltip: {
        title: "",
        lists: "",
      },
    });
    setAttributes({ content: atts });
  };

  const handlerOnSortEnd = ({ oldIndex, newIndex }) => {
    let content = [...attributes?.content];
    setIsShowTooltip(null);
    setAttributes({
      content: arrayMoveImmutable(content, oldIndex, newIndex),
    });
  };

  return (
    <Fragment>
      <div className="block block-process-service">
        <div className="holder">
          <div className="wrap">
            <RichText
              tagName="div"
              className="ttl"
              value={attributes.title}
              allowedFormats={ALLOWED_FORMATS}
              placeholder="Title"
              keepPlaceholderOnFocus={true}
              onChange={(value) => setAttributes({ title: value })}
            />

            <SortableList
              items={attributes?.content}
              onSortEnd={handlerOnSortEnd}
              axis="xy"
              helperClass="hold-item-process"
              hideSortableGhost={true}
              lockOffset={["100%"]}
              useDragHandle
              attributes={attributes}
              setAttributes={setAttributes}
              isShowTooltip={isShowTooltip}
              setIsShowTooltip={setIsShowTooltip}
              handleDelete={handleDelete}
              handleAdd={handleAdd}
            />
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
