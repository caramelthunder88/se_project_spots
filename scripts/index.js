const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
    alt: "snowy mountain",
  },

  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
    alt: "Restaurant Front",
  },

  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
    alt: "",
  },

  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
    alt: "Long bridge over tress",
  },

  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
    alt: "Tunnel with windows",
  },

  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
    alt: "Log House",
  },
];

const profileEditButton = document.querySelector(".profile__edit-button"); //step 1
const profileName = document.querySelector(".profile__title");
const profileDescripton = document.querySelector(".profile__description");

const editProfileModal = document.querySelector("#edit-profile-modal"); //gavve id to class to use id in place of class.  a hash (#) must be placed in front of id name. step 2
const closeEditProfile = editProfileModal.querySelector(".modal__close-button"); //step 1.1
const profileForm = editProfileModal.querySelector("#profile-form");
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__heading");
  const cardImageElement = cardElement.querySelector(".card__image");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  return cardElement;
}

function openModal() {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescripton.textContent;
  editProfileModal.classList.add("modal_opened"); //step 3.3 (button closes modal)
}

function closeModal() {
  editProfileModal.classList.remove("modal_opened"); //step 4 (button opens modal)
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescripton.textContent = editModalDescriptionInput.value;
  closeModal();
}

profileEditButton.addEventListener("click", openModal); //step 3

closeEditProfile.addEventListener("click", closeModal); //step 2.2
profileForm.addEventListener("submit", handleEditFormSubmit);

for (let i = 0; i < initialCards.length; i++) {
  const cardElement = getCardElement(initialCards[i]);
  cardList.prepend(cardElement);
}
