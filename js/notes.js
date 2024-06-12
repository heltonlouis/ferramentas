let tabCount = 0;
const tabs = document.getElementById("tabs");
const tabContents = document.getElementById("tabContents");
const usersNote = JSON.parse(localStorage.getItem("users")) || [];

// Load tabs from localStorage on page load
function startNotes() {
  const savedTabs = usersNote[0].tabs || [];
  if (savedTabs.length > 0) {
    savedTabs.forEach((tab) => {
      addTab(tab.id, tab.name, tab.content, false);
    });
    switchTab(savedTabs[0].id);
  } else {
    addTab();
  }
  updateAddTabButton();
}

startNotes();

async function addTab(
  tabId = null,
  tabNameText = null,
  tabContentText = "",
  switchTo = true
) {
  tabCount++;
  const id = tabId || "tab" + tabCount;

  const tab = document.createElement("div");
  tab.className = "tab";
  tab.dataset.tab = id;

  const tabName = document.createElement("span");
  tabName.innerText = tabNameText || "Nova Aba";
  tabName.style.cursor = "pointer";
  tabName.onclick = function () {
    switchTab(id);
  };
  tabName.ondblclick = function () {
    editTabName(tabName);
  };

  const closeButton = document.createElement("button");
  closeButton.innerText = "x";
  closeButton.className = "close-btn";
  closeButton.onclick = function (event) {
    event.stopPropagation();
    if (textarea.value === "") removeTab(id);
    else {
      if (confirm("Tem certeza que deseja excluir esta aba?")) {
        removeTab(id);
      }
    }
  };

  tab.appendChild(tabName);
  tab.appendChild(closeButton);

  const tabContent = document.createElement("div");
  tabContent.className = "tab-content";
  tabContent.id = id;

  const textarea = document.createElement("textarea");
  textarea.value = tabContentText;
  textarea.oninput = saveTabs;
  tabContent.appendChild(textarea);

  if (tabs.children.length > 0) {
    tabs.insertBefore(tab, tabs.children[tabs.children.length - 1]);
  } else {
    tabs.appendChild(tab);
  }
  tabContents.appendChild(tabContent);

  if (switchTo) switchTab(id);

  await configTabs(id);

  saveTabs();
}

async function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  document.querySelector(`[data-tab=${tabId}]`).classList.add("active");
  document.getElementById(tabId).classList.add("active");

  await configTabs(tabId);
}

async function configTabs(id) {
  const userConfig = usersNote[0].tabs.find((tab) => tab.id === id);
  if (!userConfig) return;
  const {
    fontSize,
    fontStyle,
    fontWeight,
    textAlign,
    textDecoration,
    fontColor,
  } = userConfig.config;
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    activeTabContent.style.fontSize = fontSize;
    activeTabContent.style.fontWeight = fontWeight;
    activeTabContent.style.fontStyle = fontStyle;
    activeTabContent.style.textAlign = textAlign;
    activeTabContent.style.textDecoration = textDecoration;
    activeTabContent.style.color = fontColor;
  }
}

function editTabName(tabName) {
  const currentName = tabName.innerText;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentName;
  input.onblur = function () {
    tabName.innerText = input.value;
    tabName.style.display = "inline";
    tabName.parentNode.removeChild(input);
    saveTabs();
  };
  input.onkeypress = function (event) {
    if (event.key === "Enter") {
      input.blur();
    }
  };

  tabName.parentNode.insertBefore(input, tabName);
  tabName.style.display = "none";
  input.focus();
}

function removeTab(tabId) {
  const tab = document.querySelector(`.tab[data-tab=${tabId}]`);
  const tabContent = document.getElementById(tabId);
  tab.remove();
  tabContent.remove();
  if (tabs.children.length > 1) {
    switchTab(tabs.children[0].dataset.tab);
  } else {
    addTab();
  }
  saveTabs();
}

function updateAddTabButton() {
  const addButton = document.querySelector(".tab.add-tab");
  if (addButton) {
    addButton.remove();
  }

  const tab = document.createElement("div");
  tab.className = "tab add-tab";
  tab.innerText = "+";
  tab.onclick = function () {
    addTab();
  };

  tabs.appendChild(tab);
}

function convertToUpperCase() {
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    activeTabContent.value = activeTabContent.value.toUpperCase();
    saveTabs();
  }
}

function convertToLowerCase() {
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    activeTabContent.value = activeTabContent.value.toLowerCase();
    saveTabs();
  }
}

function convertToCapitalized() {
  convertToLowerCase();
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    activeTabContent.value = activeTabContent.value.replace(
      /\b\w/g,
      function (char) {
        return char.toUpperCase();
      }
    );
    saveTabs();
  }
}

function fontSizeChange() {
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    activeTabContent.style.fontSize = `${fontSizeInput.value}px`;
    saveTabs();
  }
}

function fontBoldChange() {
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    if (activeTabContent.style.fontWeight === "bold") {
      activeTabContent.style.fontWeight = "normal";
    } else {
      activeTabContent.style.fontWeight = "bold";
    }
    saveTabs();
  }
}

function fontItalicChange() {
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    if (activeTabContent.style.fontStyle === "italic") {
      activeTabContent.style.fontStyle = "normal";
    } else {
      activeTabContent.style.fontStyle = "italic";
    }
    saveTabs();
  }
}

function fontUnderlineChange() {
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    if (activeTabContent.style.textDecoration === "underline") {
      activeTabContent.style.textDecoration = "none";
    } else {
      activeTabContent.style.textDecoration = "underline";
    }
    saveTabs();
  }
}

function alignLeft() {
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    activeTabContent.style.textAlign = "left";
    saveTabs();
  }
}

function alignCenter() {
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    activeTabContent.style.textAlign = "center";
    saveTabs();
  }
}

function alignRight() {
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    activeTabContent.style.textAlign = "right";
    saveTabs();
  }
}

function fontSlashChange() {
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    if (activeTabContent.style.textDecoration === "line-through") {
      activeTabContent.style.textDecoration = "none";
    } else {
      activeTabContent.style.textDecoration = "line-through";
    }
    saveTabs();
  }
}

function fontColorChange(event) {
  console.log(event);
  const activeTabContent = document.querySelector(
    ".tab-content.active textarea"
  );
  if (activeTabContent) {
    activeTabContent.style.color = event.value;
    saveTabs();
  }
}

function saveTabs() {
  const tabsData = [];
  document.querySelectorAll(".tab").forEach((tab) => {
    if (tab.dataset.tab) {
      const tabId = tab.dataset.tab;
      const tabName = tab.querySelector("span").innerText;
      var config = {};
      const tabFontSize = document
        .getElementById(tabId)
        .querySelector("textarea").style.fontSize;
      const tabFontWeight = document
        .getElementById(tabId)
        .querySelector("textarea").style.fontWeight;
      const tabFontStyle = document
        .getElementById(tabId)
        .querySelector("textarea").style.fontStyle;
      const tabTextAlign = document
        .getElementById(tabId)
        .querySelector("textarea").style.textAlign;
      const tabTextDecoration = document
        .getElementById(tabId)
        .querySelector("textarea").style.textDecoration;
      const tabFontColor = document
        .getElementById(tabId)
        .querySelector("textarea").style.color;

      config = {
        fontSize: tabFontSize,
        fontWeight: tabFontWeight,
        fontStyle: tabFontStyle,
        textAlign: tabTextAlign,
        textDecoration: tabTextDecoration,
        fontColor: tabFontColor,
      };
      const tabContent = document
        .getElementById(tabId)
        .querySelector("textarea").value;

      tabsData.push({
        id: tabId,
        name: tabName,
        content: tabContent,
        config: config,
      });
    }
  });
  usersNote[0].tabs = tabsData;
  // Organiza os tabs no users por id
  usersNote[0].tabs.sort((a, b) => a.id.localeCompare(b.id));
  userLogedIn = usersNote[0];
  localStorage.setItem("users", JSON.stringify(usersNote));
}

// Add the initial tab button
updateAddTabButton();
