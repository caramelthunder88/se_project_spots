import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
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

  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
    alt: "Image of Bridge",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  userBaseUrl: "https://around-api.en.tripleten-services.com/v1/users/me",
  headers: {
    authorization: "7f0df622-e052-48ca-afd6-8b05c9131277",
    "Content-Type": "application/json",
  },
});

let currentUserId;

api
  .getAppInfo()

  .then(([cards, userInfo]) => {
    currentUserId = userInfo._id;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatarImage.src = userInfo.avatar;
    console.log(cards);

    cards.forEach((card) => {
      const cardElement = getCardElement(card, currentUserId);
      cardList.prepend(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__plus-button");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatarImage = document.querySelector(".profile__image");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");

const editProfileModal = document.querySelector("#edit-profile-modal");
const closeEditProfile = editProfileModal.querySelector(".modal__close-button");
const profileForm = editProfileModal.querySelector("#profile-form");
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const modals = document.querySelectorAll(".modal");
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardCaptionInput = cardModal.querySelector("#add-card-caption-input");
const cardImageInput = cardModal.querySelector("#add-card-link-input");

const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button"
);
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button"
);

const cardTemplate = document.querySelector("#card-template");
const cardList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function handleLike(cardId, likeButton) {
  const isLiked = likeButton.classList.contains("card__like-button_liked");

  api
    .changeLikeStatus(cardId, !isLiked)
    .then((updatedCard) => {
      const userLiked = updatedCard.likes?.some(
        (like) => like._id === currentUserId
      );

      likeButton.classList.toggle("card__like-button_liked", userLiked);
    })
    .catch((err) => {
      console.error("Failed to toggle like:", err);
    });
}

function getCardElement(data, userId) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__heading");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  const isLiked =
    Array.isArray(data.likes) && data.likes.some((like) => like._id === userId);
  if (isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardLikeButton.addEventListener("click", () => {
    handleLike(data._id, cardLikeButton);
  });

  cardDeleteButton.addEventListener("click", () => {
    openModal(deleteModal);
    selectedCard = cardElement;
    selectedCardId = data._id;
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  return cardElement;
}

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const avatarLink = avatarInput.value;

  api
    .editAvatarInfo({ avatar: avatarLink })
    .then((data) => {
      profileAvatarImage.src = data.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error("Failed to update avatar:", err);
    });
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal.modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
});

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error("Failed to delete card:", err);
    });
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      //Use data argument instead of the input value
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error);
}

function handleCardSubmit(evt) {
  evt.preventDefault();

  const name = cardCaptionInput.value;
  const link = cardImageInput.value;

  api
    .addCard({ name, link })
    .then((card) => {
      const cardElement = getCardElement(card, currentUserId);
      cardList.prepend(cardElement);
      cardForm.reset();
      disableButton(cardSubmitButton, settings);
      closeModal(cardModal);
    })
    .catch((err) => {
      console.error("Failed to add card:", err);
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;

  resetValidation(profileForm, settings);

  openModal(editProfileModal);
});

closeEditProfile.addEventListener("click", () => {
  closeModal(editProfileModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseButton.addEventListener("click", () => {
  closeModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);
profileForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleCardSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
