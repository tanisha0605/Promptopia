"use client"
import {useState,useEffect} from 'react'
import PromptCard from './PromptCard'

const PromptCardList=({data,handleTagClick}) => {
  return(
    <div className='mt-16 prompt_layout'>
        {data.map((post)=>(
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))}
    </div>
  )
}

const Feed = () => {
const [searchText,setSearchText]=useState('');
const [searchTimeout,setSearchTimeout]=useState(null);
const[searchedResults,setSearchedResults]=useState([]);
const [allposts,setAllPosts] = useState([]);

const filterPrompts=(searchtext)=>{
  const regex = new RegExp(searchtext,"i");
  return allposts.filter(
    (item)=>
    regex.test(item.creator.username) || regex.test(item.tag) || regex.test(item.prompt)
  )
}

const handleSearchChange = e =>{
  clearTimeout(searchTimeout);
  setSearchText(e.target.value);

  setSearchTimeout(
    setTimeout(()=>{
      const searchResult=filterPrompts(e.target.value);
      setSearchedResults(searchResult)
    },500)
  )
}

const handleTagClick=(tagname)=>{
  setSearchText(tagname);
  const searchResult=filterPrompts(tagname);
  setSearchedResults(searchResult);
}
useEffect(()=>{
  const fetchPosts=async () =>{
    const response=await fetch('/api/prompt');
    const data=await response.json();

    setAllPosts(data);
  }
  fetchPosts();
},[]);
return (
  <section className='feed'>
    <form className='relative w-full flex-center'>
      <input
        type='text'
        placeholder='Search for a tag or a username'
        value={searchText}
        onChange={handleSearchChange}
        required
        className='search_input peer'
      />
    </form>
        {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList data={allposts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed