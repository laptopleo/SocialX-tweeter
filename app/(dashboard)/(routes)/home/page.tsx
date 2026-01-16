import Header from "../../_components/_common/Header";
import PostForm from "../../_components/_common/PostForm";

import PostFeed from "../../_components/PostFeed";

const Home = async () => {
  return (
    <div className="min-h-full">
      {/* Header fijo */}
      <Header label="Homeeeee" />
      <div>
        <PostForm placeholder="What is happening" />
      </div>

      <PostFeed />
      <div className="divide-y divide-gray-800"></div>
    </div>
  );
};

export default Home;
