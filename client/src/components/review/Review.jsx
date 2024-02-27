import React from 'react'
import "./Review.scss";
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';

const Review = ({ review }) => {
  // console.log("The review is " + {review});
  if (!review || !review.userId) {
    // If review or review.userId is undefined, you can decide how to handle it
    return <div>Error: Review data is missing</div>;
  }

  const { isLoading, error, data } = useQuery({
    queryKey: [review.userId],
    queryFn: () => newRequest.get(`/users/${review.userId}`)
      .then((res) => {
        return res.data;
      }),
  },);

  // console.log('Review prop:', review);
  return (
    <div className="review">
      {isLoading ? "loading" : error ? "error" : (<div className="user">
        <img
          className="pp"
          src={data.img || "/img/noavatar.jpg"}
          alt=""
        />
        <div className="info">
          <span>{data.username}</span>
          <div className="country">

            <span>{data.country}</span>
          </div>
        </div>
      </div>)}
      <div className="stars">
        {Array(review.star)
          .fill()
          .map((item, i) => (

            <img src="/img/star.png" alt="" key={i} />
          ))}

        <span>{review.star}</span>
      </div>
      <p>
        {review.desc}
      </p>
      <div className="helpful">
        <span>Helpful?</span>
        <img src="/img/like.png" alt="" />
        <span>Yes</span>
        <img src="/img/dislike.png" alt="" />
        <span>No</span>
      </div>
    </div>
  )
}

export default Review;
