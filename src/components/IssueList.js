import React from "react";
import IssueModal from "./IssueModal";

const IssueList = ({ itemList }) => {
  return (
    <ul className="list-unstyled">
      {itemList.map((item) => (
        <IssueModal key={item.id} item={item} />
      ))}
    </ul>
  );
};

export default IssueList;
