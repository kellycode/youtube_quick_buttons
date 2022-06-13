// content.js

let clickRemoveItem = function (event) {
    // returns an item number from the popup list
    // 4 is Not Interested
    // 5 is Don't recommend channel
    let listItemToRemove = event.data;

    // get the element clicked
    let target = $(event.target);
    // search up for the parent
    let theParent = target.closest("#meta");
    // grab the next sibling
    let theMenu = theParent.next();
    // and it contains the "Action menu" button (three dots)
    let theMenuButton = theMenu.find("button");

    // make sure we've got it, the action menu buttons load
    // last to the page so it takes moment.  It may be better ui
    // to disable the custom buttons until the menu is available
    if (theMenuButton.length === 1) {
        // click the button to make the menu appear
        // there's only one per page at a time so it's easy to find

        // it may be better ui to also make the menu visibility: hidden to avoid
        // the brief flash before the menu item choice is clicked
        theMenuButton.click();

        // give it half a second to be generated
        // better ui would keep track of failed attempts
        // and increase the wait time as required
        setTimeout(function () {
            // grab the list parent so we can get the children
            let listParent = $("tp-yt-paper-listbox");

            // grab the seven children items
            let listChildren = listParent.children(
                "ytd-menu-service-item-renderer"
            );

            // make sure we have seven, if we don't, it's likely the
            // menu just didn't have time to appear completely

            // if it's there, click the appropriate child item
            if (listChildren.length === 7) {
                listChildren.eq(listItemToRemove).click();
            }
        }, 500);
    }
};

let getItems = function () {
    // "ytd-video-meta-block" is used as a tag name and a class and for a variety
    // of inconsistants, however, here we look for it first by tag and
    // dev tools searching.  Use as a tag seems consistant; it's just the text blocks
    // below the videos
    // #primary is the welcome page large container, the sidebar vid container,
    // when watching a vid is #secondary, and we don't want to tag those vids
    let blocks = $("#primary ytd-video-meta-block");

    // this contains the channel name (first one) again they're using the
    //same class for a variety of reason (because they're hacks)
    let channelNameContainer = blocks.find("ytd-channel-name:first");

    channelNameContainer.each(function (index, el) {
        // now adding the custom items

        // the container for our buttons
        let mbc = $('<div class="myBtnsContainer"></div>');

        // the not int button "N"
        let mnid = $(
            '<div class="myNotIntDiv" onclick="event.stopPropagation();">N</div>'
        );

        // the don't rec button "D"
        let mdrd = $(
            '<div class="myDontRecDiv" onclick="event.stopPropagation();">D</div>'
        );

        // put it all together
        mbc.append(mnid).append(mdrd);

        // add a custome class to mark it if it doesn't already have it so we don't add it twice
        if (!$(this).hasClass("quickMarked")) {
            $(this).append(mbc);
            $(this).addClass("quickMarked");
        }

        // add the event listeners
        // event, item number, method
        mnid.on("click", 4, clickRemoveItem);
        mdrd.on("click", 5, clickRemoveItem);
    });
};

// START IT UP

// The page takes a bit to load so giving it 3 seconds here.
// Yes, other ways to do this but this is cheap and easy
setTimeout(function () {
    getItems();
}, 3000);

// this is to watch for page scroll that tends to load more vids to be tagged.
// It's a cheap and easy method that gives the scrolling a chance to stop and
// then calls the getItemsmethod
let timer = null;

// scrolling tends to be a bit eratic so we don't want to call the refresher method every time it halts
// when the window scroll stops items are added
window.addEventListener(
    "scroll",
    function () {
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            getItems();
        }, 150);
    },
    false
);
