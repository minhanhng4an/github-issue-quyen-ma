import React, { useState } from "react";
import { Media, Modal, Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Moment from "react-moment";
import { ClipLoader } from "react-spinners";

const Comment = ({ item }) => {
  return (
    <li className="d-flex ml-3 mr-3 mb-3 comment-item">
      <img
        width={150}
        height={150}
        className="mr-3 col-2"
        src={item.user.avatar_url}
        alt="Generic placeholder"
      />

      <div className="col-10 comment-body">
        <div>
          <span className="text-grey mr-2">@{item.user.login}</span>
          <span className="text-grey">
            commented <Moment fromNow>{item.created_at}</Moment>
          </span>
        </div>
        <ReactMarkdown skipHtml>{item.body}</ReactMarkdown>
      </div>
    </li>
  );
};

const IssueModal = ({ item }) => {
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState([]);
  const [showMore, setShowMore] = useState(2);
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    const fetchComment = async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        setComment(data);
      }
    };

    fetchComment(item.comments_url);
    setShow(true);
  };

  return (
    <>
      <Media as="li" className="mt-4" onClick={handleShow}>
        <img
          width={150}
          height={150}
          className="mr-3"
          src={item.user.avatar_url}
          alt="Generic placeholder"
        />
        <Media.Body>
          <h5>
            <a className="no-under" href="#">
              {`#${item.number}`}: {item.title}
            </a>
          </h5>
          <div className="issue-description">
            <ReactMarkdown skipHtml>
              {item.body.length <= 100 ? item.body : item.body.slice(0, 99)}
            </ReactMarkdown>
          </div>
          <span>
            Last update: <Moment fromNow>{item.updated_at}</Moment>
          </span>
        </Media.Body>
      </Media>

      <Modal size="xl" className="p-10px" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {`#${item.number}`}: {item.title}
            <Button
              variant="primary"
              className="ml-5"
              size="md"
              active
              onClick={() => window.open(item.html_url, "_blank")}
            >
              Open in Github
            </Button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="overflow-y: auto">
          <ReactMarkdown skipHtml>{item.body}</ReactMarkdown>
        </Modal.Body>
        <Modal.Title>
          <hr></hr>
          <div>
            <h3 className="comment-header">Comments:</h3>
          </div>
          <div>
            <ul className="row m-0 flex-column list-unstyled listcmt">
              {comment.slice(0, showMore).map((item) => (
                <Comment key={item.id} item={item} />
              ))}
              {item.comments === 0 && (
                <li className="fix-text">
                  There are no comment on this issue.
                </li>
              )}
              {item.comments > 5 && showMore < item.comments && (
                <li className="ml-auto mr-auto mb-3">
                  {!isCommentLoading ? (
                    <Button
                      onClick={() => {
                        setIsCommentLoading(true);
                        setShowMore(showMore + 2);
                        setIsCommentLoading(false);
                      }}
                    >
                      Show more
                    </Button>
                  ) : (
                    <ClipLoader
                      color="#f86c6b"
                      size={75}
                      loading={isCommentLoading}
                    />
                  )}
                </li>
              )}
            </ul>
          </div>
        </Modal.Title>
      </Modal>
    </>
  );
};

export default IssueModal;
