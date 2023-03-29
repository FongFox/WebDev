run();

//function
function run() {
    //variables (take HTML elements)
    var tabItems = document.querySelectorAll(".tab-item");
    var tabPanes = document.querySelectorAll(".tab-pane");
    var line = document.querySelector(".line");
    var tabItemActive = document.querySelector(".tab-item.active");
    //function handle change process
    handleChange(tabItems, tabPanes, line, tabItemActive);
}
function handleChange(tabItems, tabPanes, line, tabItemActive) {
    //current line
    line.style.left = tabItemActive.offsetLeft + "px";
    line.style.width = tabItemActive.offsetWidth + "px";
    //dùng forEach để duyệt từng phần tử (lắng nghe sự kiện click)
    tabItems.forEach(function(tab, index) {
        tab.onclick = function () {
            //when clicking tab active & tab pane:
            //1. Remove current 'active'
            document.querySelector('.tab-item.active').classList.remove(
                'active'
            );
            document.querySelector('.tab-pane.active').classList.remove(
                'active'
            );
            //add new 'active' 
            this.classList.add("active");
            tabPanes[index].classList.add("active");
            //change 'line'
            line.style.left = this.offsetLeft + "px";
            line.style.width = this.offsetWidth + "px";
        };
    });
}
//  function handleChangeTabPane(tabPanes, tabItemsIndex) {
//     //----------------------
//     // tabPanes.forEach(function(tabPane) {
//     //     var tabPaneDelete = document.querySelector('.tab-pane.active');
//     //     tabPaneDelete.classList.remove('active');
//     //     this.classList.add('active');
//     // })
//     var tabPaneDelete = document.querySelector('.tab-pane.active');
//     tabPaneDelete.classList.remove('active');
//     var tabPane = tabPanes[tabItemsIndex];
//     tabPane.classList.add('active');
//  }

