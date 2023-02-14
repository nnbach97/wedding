import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  RichText,
} from "@wordpress/block-editor";
import { Fragment } from "@wordpress/element";
import { ALLOWED_FORMATS } from "../../../../config/define";
import { ImageUploadSingle } from "../../../../components/image-upload";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

const DragHandle = sortableHandle(() => (
  <span className="admin-buttom-move-item">
    <span class="dashicons dashicons-move"></span>
  </span>
));

const SortableItem = SortableElement((props) => {
  const { object, data_key, attributes, setAttributes, handlerDelete } = props;
  return (
    <div class="item">
      <button
        onClick={(event) => handlerDelete(event, data_key)}
        className="admin-buttom-delete-item"
      >
        <span class="dashicons dashicons-no"></span>
      </button>
      <DragHandle />
      <div class="header">
        <div class="img">
          <ImageUploadSingle
            value={object?.icon}
            onChange={(value) => {
              let att = [...attributes?.item];
              let new_icon = { ...object, icon: value };
              att[data_key] = new_icon;
              setAttributes({ item: att });
            }}
          />
        </div>
        <RichText
          tagName="p"
          className="ttl"
          allowedFormats={ALLOWED_FORMATS}
          placeholder="Title"
          keepPlaceholderOnFocus={true}
          value={object?.title}
          onChange={(value) => {
            let att = [...attributes?.item];
            let new_title = { ...object, title: value };
            att[data_key] = new_title;
            setAttributes({ item: att });
          }}
        />
      </div>
      <div class="main">
        <RichText
          tagName="p"
          className="desc"
          allowedFormats={ALLOWED_FORMATS}
          placeholder="Description"
          keepPlaceholderOnFocus={true}
          value={object?.description}
          onChange={(value) => {
            let att = [...attributes?.item];
            let new_description = { ...object, description: value };
            att[data_key] = new_description;
            setAttributes({ item: att });
          }}
        />
        <RichText
          tagName="p"
          className="note"
          allowedFormats={ALLOWED_FORMATS}
          placeholder="Note"
          keepPlaceholderOnFocus={true}
          value={object?.note}
          onChange={(value) => {
            let att = [...attributes?.item];
            let new_note = { ...object, note: value };
            att[data_key] = new_note;
            setAttributes({ item: att });
          }}
        />
      </div>
    </div>
  );
});

const SortableList = SortableContainer((props) => {
  const { items, attributes, setAttributes, handlerAdd, handlerDelete } = props;
  return (
    <div className="list">
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
              handlerDelete={handlerDelete}
            />
          );
        })}
      <div className="item">
        <button class="admin-buttom-add-item" onClick={handlerAdd}>
          <span class="dashicons dashicons-plus-alt2"></span>
        </button>
      </div>
    </div>
  );
});

const FragmentBlock = function ({ props }) {
  const { attributes, setAttributes } = props;

  const handlerDelete = (event, index) => {
    event.stopPropagation();
    const atts = [...attributes?.item];
    atts.splice(index, 1);
    setAttributes({ item: atts });
  };
  const handlerAdd = () => {
    let item = [...attributes?.item];
    let new_item = {
      icon: {
        id: item.length + 1,
        alt: "",
        url: "",
      },
      title: "",
      description: "",
      note: "",
    };
    item.push(new_item);
    setAttributes({ item: item });
  };

  const handlerOnSortEnd = ({ oldIndex, newIndex }) => {
    let items = [...attributes?.item];
    setAttributes({
      item: arrayMoveImmutable(items, oldIndex, newIndex),
    });
  };

  return (
    <Fragment>
      <div className="block block-veramine-technology">
        <div class="option">
          <div class="holder">
            <SortableList
              items={attributes?.item}
              onSortEnd={handlerOnSortEnd}
              axis="xy"
              helperClass="hold-item-technology"
              hideSortableGhost={true}
              lockOffset={["100%"]}
              useDragHandle
              attributes={attributes}
              setAttributes={setAttributes}
              handlerAdd={handlerAdd}
              handlerDelete={handlerDelete}
            />
            <RichText
              tagName="div"
              className="feature-txt"
              allowedFormats={ALLOWED_FORMATS}
              placeholder="Feature"
              keepPlaceholderOnFocus={true}
              value={attributes?.feature_text}
              onChange={(value) => {
                setAttributes({ feature_text: value });
              }}
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
      <FragmentBlock props={props}></FragmentBlock>
    </div>
  );
}
