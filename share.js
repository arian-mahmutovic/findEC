//Sharing
const shareButton = document.querySelector("#share-button");

shareButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const shareData = {
        title: "Project Epictetus",
        text: "Join Project Epictetus — a network built for ambitious students.",
        url: "https://epictetusproject.com"
    };

    if (navigator.share) {
        await navigator.share(shareData);
    } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Website link copied to clipboard!");
    }
});

const shareFab = document.querySelector("#share-fab");

shareFab.addEventListener("click", async () => {

    const shareData = {
        title: "Project Epictetus",
        text: "Try Epictetus, a one-stop platform for finding competitions for students.",
        url: "https://epictetusproject.com"
    };

    try {

        if (navigator.share) {

            await navigator.share(shareData);

        } else {

            await navigator.clipboard.writeText(shareData.url);
            alert("Link copied to clipboard!");

        }

    } catch (error) {

        console.error(error);

    }

});