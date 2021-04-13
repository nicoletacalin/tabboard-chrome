apiFetch = () =>{
    fetch(`http://www.omdbapi.com/?s=matrix&apikey=adf1f2d7`)
    .then(response => response.json())
    .then((data)=>{
      console.log("api fetch response:", data);
    });
}

apiPost = (outbound_data) => {
  fetch("https://httpbin.org/post", {
    method: "POST",
    body: JSON.stringify({"data obj": outbound_data})
  })
    .then(response => response.json())
    .then((data) => {
    console.log("post return", data); // Look at local_names.default
  });
}

export { apiFetch, apiPost };
