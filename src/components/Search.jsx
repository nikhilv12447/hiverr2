import React, { Component } from 'react';
import "./search.css";

var timeInterval;
class Search extends Component {
    state = {
        queryStr: "",
        hits: []
    }

    onSearch = (e) => {
        if (timeInterval) {
            clearInterval(timeInterval);
        }

        timeInterval = setTimeout(() => {
            var url;
            if (e.target.value) {
                url = `https://hn.algolia.com/api/v1/search?query=${e.target.value}`
            } else {
                url = "https://hn.algolia.com/api/v1/search"
            }
            fetch(url).then(response => {
                return response.json();
            }).then(data => {
                this.setState({
                    queryStr: e.target.value,
                    hits: this.getSortByRelevancyScore(data.hits)
                })
            })
        }, 500);
    }

    getSortByRelevancyScore = (hits) => {
        hits = hits.filter(hit => hit.relevancy_score ? true : false)
        hits.sort(function (a, b) {
            return b.relevancy_score - a.relevancy_score
        });

        hits = hits.filter((hit, index) => index < 10 ? true : false);
        return hits
    }

    render() {
        var { hits, queryStr } = this.state;
        return (
            <React.Fragment>
                <div className="text-center">
                    <h5 htmlFor="">Search Hacker News</h5>
                    <input type="text" onChange={this.onSearch} placeholder=""/>
                </div>
                <div>
                    {
                        hits.map((hit, index) => {
                            var { title, url, author, months, num_comments, story_text, _highlightResult } = hit;
                            console.log(_highlightResult)
                            return (
                                <HitFormat
                                    key={index}
                                    title={title}
                                    url={url}
                                    author={author}
                                    comments={num_comments}
                                    story={story_text}
                                    highlightedResult={_highlightResult}
                                    queryStr={queryStr}
                                />
                            );
                        })
                    }
                </div>
            </React.Fragment>
        );
    }
}

function HitFormat(props) {
    var { title, url, author, months, comments, story, highlightedResult, queryStr } = props;
    if(queryStr){
        title = highlightedResult.title ? highlightedResult.title.value : title;
        story = highlightedResult.story_text ? highlightedResult.story_text.value : story;
    }
    return (
        <div className="mt-2 border">
            <b><span dangerouslySetInnerHTML={{ __html: title }} /></b>
            {
                url && <span className="ml-2">({url})</span>
            }
            <div>
                <span>Author: {author} | { } months ago | {comments} comments</span>
            </div>
            {
                story &&
                <p className="mt-1" dangerouslySetInnerHTML={{ __html: story }} />
            }
        </div>
    );
}
export default Search;