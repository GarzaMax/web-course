document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.querySelector(".preloader");
    const content = document.getElementById("content");

    preloader.style.display = "block";

    const fetchData = async () => {
        try {
            const randomFilter = Math.random() > 0.5 ? '?postId=1' : '?postId=2';
            await new Promise(r => setTimeout(r, 3000));
            const response = await fetch(`https://jsonplaceholder.typicode.com/comments${randomFilter}`);

            if (!response.ok) {
                alert(`Failed to fetch comments`);
            }

            const data = await response.json();

            preloader.style.display = "none";

            renderComments(data);
        } catch (error) {
            preloader.style.display = "none";
            content.innerHTML = `<div class="error">⚠ Что-то пошло не так: ${error.message}</div>`;
        }
    };

    const renderComments = (comments) => {
        content.innerHTML = comments
            .slice(0, 10)
            .map(
                (comment) =>
                    `<div>
            <h3>${comment.name}</h3>
            <p>${comment.body}</p>
            <small>${comment.email}</small>
          </div>`
            )
            .join("");
    };

    fetchData();
});