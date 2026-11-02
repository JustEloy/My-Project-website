/* Profile avatar: click to enlarge, change photo, remember it. */
(function () {
    var avatar = document.getElementById("profileAvatar");
    var avatarImg = document.getElementById("profileAvatarImage");
    var preview = document.getElementById("profilePreview");
    var previewImg = document.getElementById("profilePreviewImage");
    var closeBtn = document.getElementById("closeProfilePreview");
    var changeBtn = document.getElementById("changeProfilePhoto");
    var input = document.getElementById("profilePhotoInput");
    if (!avatar || !preview) return;

    try {
        var saved = localStorage.getItem("profilePhoto");
        if (saved && avatarImg) avatarImg.src = saved;
    } catch (e) {}

    function open() {
        if (previewImg && avatarImg) previewImg.src = avatarImg.src;
        preview.hidden = false;
        avatar.setAttribute("aria-expanded", "true");
    }

    function close() {
        preview.hidden = true;
        avatar.setAttribute("aria-expanded", "false");
    }

    avatar.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    preview.addEventListener("click", function (e) { if (e.target === preview) close(); });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !preview.hidden) close();
    });

    if (changeBtn && input) {
        changeBtn.addEventListener("click", function () { input.click(); });
        input.addEventListener("change", function () {
            var file = input.files && input.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function () {
                if (avatarImg) avatarImg.src = reader.result;
                if (previewImg) previewImg.src = reader.result;
                try { localStorage.setItem("profilePhoto", reader.result); } catch (e) {}
            };
            reader.readAsDataURL(file);
        });
    }
})();