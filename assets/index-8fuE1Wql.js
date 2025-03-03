var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _winningNumbers, _bonusNumber, _lottoNumbersList, _LottoResult_instances, isBonusMatched_fn, calculateMatchCount_fn, _numbers, _bonusNumber2, _WinningLotto_instances, isRangeValid_fn, isDistinct_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const addKeyListener = (selector, callback, key) => {
  document.querySelectorAll(selector).forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === key) {
        e.preventDefault();
        input.blur();
        callback();
      }
    });
  });
};
const disableElement = (name) => {
  const element = document.querySelector(`[name=${name}]`);
  element.disabled = true;
};
const enableElement = (name) => {
  const element = document.querySelector(`[name=${name}]`);
  element.disabled = false;
};
let state = {
  lottoCount: null,
  lottoArray: [],
  winningLotto: null,
  matchingCount: null,
  profitRate: null
};
let prevState = {
  ...state
};
const resetState = () => {
  prevState = { ...state };
  state = {
    lottoCount: null,
    lottoArray: null,
    matchingCount: null,
    profitRate: null
  };
};
const setState = (newState) => {
  prevState = { ...state };
  state = { ...state, ...newState };
};
const getState = () => state;
const getPrevState = () => prevState;
const LOTTO_NUMBERS = {
  LENGTH: 6,
  BONUS_LENGTH: 1,
  MIN: 1,
  MAX: 45
};
const LOTTO_PRICE = {
  MIN: 1e3,
  MAX: 1e5,
  UNIT: 1e3
};
const LOTTO_PRIZE = {
  3: 5e3,
  4: 5e4,
  5: 15e5,
  6: 2e9,
  bonus: 3e7
};
const setInputCss = (style) => {
  if (style === "large") {
    return "large-input";
  }
  if (style === "small") {
    return "small-input";
  }
};
const LottoNumberInput = ({ name, style = "small", placeholder = "" }) => {
  const lottoNumberInput = document.createElement("input");
  console.log(`작동 : ${setInputCss(style)}`);
  lottoNumberInput.classList.add(setInputCss(style));
  lottoNumberInput.min = LOTTO_NUMBERS.MIN;
  lottoNumberInput.max = LOTTO_NUMBERS.MAX;
  lottoNumberInput.step = "1";
  lottoNumberInput.type = "number";
  lottoNumberInput.pattern = "^[0-9]+$";
  lottoNumberInput.name = name;
  lottoNumberInput.placeholder = placeholder;
  return lottoNumberInput;
};
const WinningInput = () => {
  const winningInputWrap = document.createElement("div");
  winningInputWrap.classList.add("winning-input-wrap");
  const winningInputContainer = document.createElement("div");
  winningInputContainer.classList.add("winning-input-container");
  const winningInputLabel = document.createElement("div");
  winningInputLabel.textContent = "당첨 번호";
  winningInputWrap.appendChild(winningInputLabel);
  Array.from({ length: LOTTO_NUMBERS.LENGTH }, () => {
    winningInputContainer.appendChild(LottoNumberInput({ name: "winning-number" }));
  });
  winningInputWrap.appendChild(winningInputContainer);
  return winningInputWrap;
};
const BonusInput = () => {
  const bonusInputWrap = document.createElement("div");
  bonusInputWrap.classList.add("bonus-input-wrap");
  const bonusInputLabel = document.createElement("div");
  bonusInputLabel.textContent = "보너스 번호";
  bonusInputWrap.appendChild(bonusInputLabel);
  bonusInputWrap.appendChild(LottoNumberInput({ name: "bonus-number" }));
  return bonusInputWrap;
};
const LottoNumbers = ({ lottoArray }) => {
  const fragment = document.createDocumentFragment();
  lottoArray.forEach((lotto) => {
    fragment.appendChild(LottoNumber({ lotto }));
  });
  return fragment;
};
const LottoNumber = ({ lotto }) => {
  const lottoNumbersItem = document.createElement("div");
  lottoNumbersItem.classList.add("lotto-numbers-item");
  const lottoItem = document.createElement("div");
  lottoItem.classList.add("lotto-numbers");
  lottoItem.textContent = lotto.numbers.join(", ");
  const lottoImage = document.createElement("img");
  lottoImage.classList.add("lotto-image");
  lottoImage.src = `./lotto.png`;
  lottoImage.alt = "로또 이미지";
  lottoNumbersItem.appendChild(lottoImage);
  lottoNumbersItem.appendChild(lottoItem);
  return lottoNumbersItem;
};
const setButtonCss = (style) => {
  if (style === "large") {
    return "large-button";
  }
  if (style === "small") {
    return "small-button";
  }
};
const Button = ({ label, onClick, style = "large", name }) => {
  const button = document.createElement("button");
  button.classList.add("font-weight-body");
  button.classList.add(setButtonCss(style));
  button.textContent = label;
  button.name = name;
  if (onClick) {
    button.addEventListener("click", onClick);
  }
  return button;
};
const Prompt = ({ message, style }) => {
  const countPrompt = document.createElement("pre");
  countPrompt.textContent = message;
  countPrompt.classList.add("font-body");
  if (style === "warning") {
    countPrompt.classList.add("warning");
    countPrompt.classList.add("font-body");
  }
  return countPrompt;
};
const removeModal = () => {
  const modalContainer = document.querySelector(".modal-container");
  if (modalContainer) {
    modalContainer.remove();
  }
};
const Modal = ({ content }) => {
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");
  modalContainer.appendChild(ModalBackground());
  modalContainer.appendChild(ModalLayout({ content }));
  return modalContainer;
};
const ModalBackground = () => {
  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modal-background");
  modalBackground.addEventListener("click", () => {
    removeModal();
  });
  return modalBackground;
};
const ModalLayout = ({ content }) => {
  const modalContents = document.createElement("div");
  modalContents.classList.add("modal");
  modalContents.appendChild(content);
  return modalContents;
};
const formatNumber = (number) => {
  return number.toLocaleString();
};
const appendElement = (parentElement, ...childElement) => {
  childElement.forEach((element) => document.querySelector(`${parentElement}`).appendChild(element));
};
const removeElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) element.remove();
};
const clearElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = "";
};
const resetUI = () => {
  const elementsToClear = [".count-prompt", ".lotto-numbers-container", ".winning-prompt", ".winning-bonus-container", ".result-button-container"];
  elementsToClear.forEach(clearElement);
  const elementsToRemove = [".modal-container", ".warning"];
  elementsToRemove.forEach(removeElement);
};
const RetryController = () => {
  resetState();
  resetUI();
  enableElement("purchase");
  enableElement("price");
  document.querySelector("[name=price]").value = "";
};
const Result = ({ matchingCount, profitRate }) => {
  const resultContainer = document.createElement("div");
  resultContainer.classList.add("result-container");
  const title = document.createElement("div");
  title.classList.add("font-subtitle");
  title.textContent = "🏆 당첨 통계 🏆";
  const exitIcon = ExitIcon();
  const resultProfit = document.createElement("div");
  resultProfit.classList.add("font-weight-body");
  resultProfit.textContent = `당신의 총 수익률은 ${profitRate}%입니다.`;
  resultContainer.appendChild(exitIcon);
  resultContainer.appendChild(title);
  resultContainer.appendChild(ResultTable({ matchingCount }));
  resultContainer.appendChild(resultProfit);
  resultContainer.appendChild(Button({ label: "다시 시작하기", style: "large", name: "retry", onClick: RetryController }));
  return resultContainer;
};
const ExitIcon = () => {
  const exitIconContainer = document.createElement("div");
  exitIconContainer.classList.add("exit-icon-container");
  const exitIcon = document.createElement("img");
  exitIcon.src = `./close.png`;
  exitIcon.classList.add("exit-icon");
  exitIconContainer.appendChild(exitIcon);
  exitIconContainer.addEventListener("click", () => {
    removeModal();
  });
  return exitIconContainer;
};
const ResultTable = ({ matchingCount }) => {
  const resultTable = document.createElement("table");
  const headContent = ["일치 갯수", "당첨금", "당첨 갯수"];
  resultTable.appendChild(TableHead(headContent));
  Object.keys(matchingCount).forEach((count) => {
    const tableData = {
      matchingCount: `${count}개`,
      prize: formatNumber(LOTTO_PRIZE[count]),
      winningCount: matchingCount[count]
    };
    if (count === "bonus") {
      tableData.matchingCount = "5개+보너스볼";
    }
    resultTable.appendChild(TableData(tableData));
  });
  return resultTable;
};
const TableHead = (headContent) => {
  const tableRow = document.createElement("tr");
  const fragment = document.createDocumentFragment();
  headContent.forEach((i) => {
    const tableHead = document.createElement("th");
    tableHead.textContent = i;
    fragment.appendChild(tableHead);
    return tableHead;
  });
  tableRow.appendChild(fragment);
  return tableRow;
};
const TableData = ({ matchingCount = "n개", prize = "5000원", winningCount = "n개" }) => {
  const tableRow = document.createElement("tr");
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createTableData(matchingCount));
  fragment.appendChild(createTableData(prize));
  fragment.appendChild(createTableData(winningCount));
  tableRow.appendChild(fragment);
  return tableRow;
};
const createTableData = (text) => {
  const tableData = document.createElement("td");
  tableData.textContent = text;
  return tableData;
};
const SYSTEM_MESSAGE = {
  CANNOT_RETRY: "결과를 확인한 후 재구매할 수 있습니다."
};
const calculateWinningAmount = (matchingCount) => {
  return Object.keys(matchingCount).reduce((sum, count) => sum + matchingCount[count] * (LOTTO_PRIZE[count] || 0), 0);
};
const calculateProfitRate = (matchingCount, lottoCount) => {
  const winningAmount = calculateWinningAmount(matchingCount);
  const profitRatio = winningAmount / (lottoCount * LOTTO_PRICE.UNIT);
  return (profitRatio * 100).toFixed(1);
};
class LottoResult {
  constructor(winningLotto, lottoArray) {
    __privateAdd(this, _LottoResult_instances);
    __privateAdd(this, _winningNumbers);
    __privateAdd(this, _bonusNumber);
    __privateAdd(this, _lottoNumbersList);
    __privateSet(this, _winningNumbers, winningLotto.numbers);
    __privateSet(this, _bonusNumber, winningLotto.bonusNumber);
    __privateSet(this, _lottoNumbersList, lottoArray.map((lotto) => lotto.numbers));
  }
  calculateResult() {
    const lottoResult = { 3: 0, 4: 0, 5: 0, 6: 0, bonus: 0 };
    __privateGet(this, _lottoNumbersList).forEach((lottoNumbers) => {
      const matchingCount = __privateMethod(this, _LottoResult_instances, calculateMatchCount_fn).call(this, lottoNumbers);
      if (matchingCount < 3) return;
      if (matchingCount === 5 && __privateMethod(this, _LottoResult_instances, isBonusMatched_fn).call(this, lottoNumbers)) {
        lottoResult["bonus"]++;
        return;
      }
      lottoResult[matchingCount]++;
    });
    return lottoResult;
  }
}
_winningNumbers = new WeakMap();
_bonusNumber = new WeakMap();
_lottoNumbersList = new WeakMap();
_LottoResult_instances = new WeakSet();
isBonusMatched_fn = function(lottoNumbers) {
  return lottoNumbers.includes(__privateGet(this, _bonusNumber));
};
calculateMatchCount_fn = function(lottoNumbers) {
  return lottoNumbers.filter((number) => __privateGet(this, _winningNumbers).includes(number)).length;
};
const ResultController = () => {
  const { lottoCount, lottoArray, winningLotto } = getState();
  const lottoResult = new LottoResult(winningLotto, lottoArray);
  const matchingCount = lottoResult.calculateResult();
  const profitRate = calculateProfitRate(matchingCount, lottoCount);
  setState({ profitRate, matchingCount });
  updateUI();
};
const LOTTO_NUMBERS_ERROR_MESSAGE = {
  EMPTY: "로또 번호를 입력해주세요",
  EMPTY_ITEM: "로또 번호에 빈 값이 포함되어 있습니다. 다시 입력해주세요",
  LENGTH: `로또 번호는 ${LOTTO_NUMBERS.LENGTH}개 여야합니다. 다시 입력해 주세요.`,
  RANGE: `로또 번호는 ${LOTTO_NUMBERS.MIN}부터 ${LOTTO_NUMBERS.MAX}사이의 숫자여야 합니다. 다시 입력해 주세요.`,
  DUPLICATE: "로또 번호가 중복됐습니다. 다시 입력해 주세요.",
  NUMBER: "숫자만 입력할 수 있습니다. 다시 입력해 주세요."
};
const BONUS_NUMBER_ERROR_MESSAGE = {
  EMPTY: "보너스 번호를 입력해주세요.",
  NUMBER: "숫자를 입력해주세요.",
  RANGE: `보너스 번호는 ${LOTTO_NUMBERS.MIN}부터 ${LOTTO_NUMBERS.MAX}사이의 숫자여야 합니다. 다시 입력해 주세요.`,
  DUPLICATE: "보너스 번호가 당첨 번호와 중복됩니다. 다시 입력해주세요."
};
const PRICE_ERROR_MESSAGE = {
  EMPTY: "구입 금액을 입력해주세요.",
  NUMBER: "숫자를 입력해주세요.",
  UNDER_PRICE: `${formatNumber(LOTTO_PRICE.MIN)}원보다 큰 수를 입력해주세요`,
  INDIVISIBLE: `구입 금액은 ${formatNumber(LOTTO_PRICE.UNIT)}원 단위여야 합니다.`,
  OVER_PRICE: `${formatNumber(LOTTO_PRICE.MAX)}원까지 입력 가능합니다.`
};
const validationCondition = {
  isNumber(input) {
    return !isNaN(input);
  },
  isTooLarge(input, threshold) {
    return Number(input) > threshold;
  },
  isEmpty(input) {
    return input === "" || input.length === 0;
  },
  isUnder(input, threshold) {
    return Number(input) < threshold;
  },
  isDivisible(input, divisor) {
    return Number(input) % divisor === 0;
  },
  isLengthValid(numbers, length) {
    return numbers.length === length;
  },
  isRangeValid(numbers, min, max) {
    return !numbers.some((number) => number < min || number > max);
  },
  isDistinct(numbers) {
    return new Set(numbers).size === numbers.length;
  },
  isBonusDistinct(numbers, bonusNumber) {
    return (/* @__PURE__ */ new Set([...numbers, Number(bonusNumber)])).size !== numbers.length;
  },
  isBonusRangeValid(bonusNumber, min, max) {
    return Number(bonusNumber) <= max && Number(bonusNumber) >= min;
  }
};
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _numbers);
    this.validate(numbers);
    __privateSet(this, _numbers, numbers.sort((a, b) => a - b));
  }
  get numbers() {
    return __privateGet(this, _numbers);
  }
  validate(numbers) {
    if (!validationCondition.isLengthValid(numbers, LOTTO_NUMBERS.LENGTH)) {
      throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.LENGTH);
    }
    if (!validationCondition.isRangeValid(numbers, LOTTO_NUMBERS.MIN, LOTTO_NUMBERS.MAX)) {
      throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.RANGE);
    }
    if (!validationCondition.isDistinct(numbers)) {
      throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.DUPLICATE);
    }
  }
}
_numbers = new WeakMap();
class WinningLotto extends Lotto {
  constructor(numbers, bonusNumber) {
    super(numbers);
    __privateAdd(this, _WinningLotto_instances);
    __privateAdd(this, _bonusNumber2);
    if (!__privateMethod(this, _WinningLotto_instances, isRangeValid_fn).call(this, bonusNumber)) {
      throw new Error(BONUS_NUMBER_ERROR_MESSAGE.RANGE);
    }
    if (!__privateMethod(this, _WinningLotto_instances, isDistinct_fn).call(this, numbers, bonusNumber)) {
      throw new Error(BONUS_NUMBER_ERROR_MESSAGE.DUPLICATE);
    }
    __privateSet(this, _bonusNumber2, bonusNumber);
  }
  get bonusNumber() {
    return __privateGet(this, _bonusNumber2);
  }
}
_bonusNumber2 = new WeakMap();
_WinningLotto_instances = new WeakSet();
isRangeValid_fn = function(bonusNumber) {
  return bonusNumber >= LOTTO_NUMBERS.MIN && bonusNumber <= LOTTO_NUMBERS.MAX;
};
isDistinct_fn = function(numbers, bonusNumber) {
  return !numbers.includes(bonusNumber);
};
const parsePrice = (priceInput) => {
  return Number(priceInput);
};
const parseWinningNumbers = (winningNumberInput) => {
  return winningNumberInput.split(",").map(Number);
};
const parseBonusNumber = (bonusNumberInput) => {
  return Number(bonusNumberInput);
};
const runValidators = (validators, input) => validators.forEach((validate) => validate(input));
const checkIsEmpty = (bonusNumberInput) => {
  if (validationCondition.isEmpty(bonusNumberInput)) {
    throw new Error(BONUS_NUMBER_ERROR_MESSAGE.EMPTY);
  }
};
const checkIsNumber$2 = (bonusNumberInput) => {
  if (!validationCondition.isNumber(bonusNumberInput)) {
    throw new Error(BONUS_NUMBER_ERROR_MESSAGE.NUMBER);
  }
};
const checkRange$1 = (bonusNumberInput) => {
  if (!validationCondition.isBonusRangeValid(bonusNumberInput, LOTTO_NUMBERS.MIN, LOTTO_NUMBERS.MAX)) {
    throw new Error(BONUS_NUMBER_ERROR_MESSAGE.RANGE);
  }
};
const checkDuplicate = (winningNumbers, bonusNumberInput) => {
  if (!validationCondition.isBonusDistinct(winningNumbers, bonusNumberInput)) {
    throw new Error(BONUS_NUMBER_ERROR_MESSAGE.DUPLICATE);
  }
};
const validateBonusNumber = (winningNumbers, bonusNumberInput) => {
  runValidators([checkIsEmpty, checkIsNumber$2, checkRange$1, (bonusNumberInput2) => checkDuplicate(winningNumbers, bonusNumberInput2)], bonusNumberInput);
};
const checkEmptyInput$1 = (priceInput) => {
  if (validationCondition.isEmpty(priceInput)) {
    throw new Error(PRICE_ERROR_MESSAGE.EMPTY);
  }
};
const checkIsTooLarge = (priceInput) => {
  if (validationCondition.isTooLarge(priceInput, LOTTO_PRICE.MAX)) {
    throw new Error(PRICE_ERROR_MESSAGE.OVER_PRICE);
  }
};
const checkIsNumber$1 = (priceInput) => {
  if (!validationCondition.isNumber(priceInput)) {
    throw new Error(PRICE_ERROR_MESSAGE.NUMBER);
  }
};
const checkUnderPrice = (priceInput) => {
  if (validationCondition.isUnder(priceInput, LOTTO_PRICE.MIN)) {
    throw new Error(PRICE_ERROR_MESSAGE.UNDER_PRICE);
  }
};
const checkDivisiblePrice = (priceInput) => {
  if (!validationCondition.isDivisible(priceInput, LOTTO_PRICE.UNIT)) {
    throw new Error(PRICE_ERROR_MESSAGE.INDIVISIBLE);
  }
};
const validatePrice = (priceInput) => runValidators([checkEmptyInput$1, checkIsNumber$1, checkIsTooLarge, checkUnderPrice, checkDivisiblePrice], priceInput);
const checkEmptyInput = (winningNumberInput) => {
  if (validationCondition.isEmpty(winningNumberInput)) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.EMPTY);
  }
};
const checkEmptyItem = (winningNumberInput) => {
  if (winningNumberInput.some((number) => validationCondition.isEmpty(number))) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.EMPTY_ITEM);
  }
};
const checkIsNumber = (winningNumberInput) => {
  if (winningNumberInput.some((number) => !validationCondition.isNumber(number))) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.NUMBER);
  }
};
const checkLengthValid = (winningNumberInput) => {
  if (!validationCondition.isLengthValid(winningNumberInput, LOTTO_NUMBERS.LENGTH)) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.LENGTH);
  }
};
const checkRange = (winningNumberInput) => {
  if (!validationCondition.isRangeValid(winningNumberInput, LOTTO_NUMBERS.MIN, LOTTO_NUMBERS.MAX)) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.RANGE);
  }
};
const checkIsDistinct = (winningNumberInput) => {
  if (!validationCondition.isDistinct(winningNumberInput)) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.DUPLICATE);
  }
};
const validateWinningNumber = (winningNumberInput) => {
  const winningNumbers = winningNumberInput.split(",");
  return runValidators([checkEmptyInput, checkEmptyItem, checkIsNumber, checkLengthValid, checkRange, checkIsDistinct], winningNumbers);
};
const InputUtil = {
  readInput(name) {
    const inputElement = document.querySelector(`[name=${name}]`);
    return inputElement.value;
  },
  readInputs(name) {
    const inputs = document.querySelectorAll(`[name=${name}]`);
    return Array.from(inputs).map((input) => input.value).join(", ");
  }
};
const getPrice = () => {
  const priceInput = InputUtil.readInput("price");
  validatePrice(priceInput);
  return parsePrice(priceInput);
};
const getWinningNumber = () => {
  const winningNumberInput = InputUtil.readInputs("winning-number");
  validateWinningNumber(winningNumberInput);
  return parseWinningNumbers(winningNumberInput);
};
const getBonusNumber = (winningNumbers) => {
  const bonusNumberInput = InputUtil.readInputs("bonus-number");
  validateBonusNumber(winningNumbers, bonusNumberInput);
  return parseBonusNumber(bonusNumberInput);
};
const Alert = ({ message }) => {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.classList.add("font-body");
  alert.textContent = message;
  return alert;
};
const alertError = (asyncFn) => {
  try {
    return asyncFn();
  } catch (error) {
    if (!document.querySelector(".alert")) {
      appendElement(".alert-container", Alert({ message: error.message }));
      setTimeout(() => {
        document.querySelector(".alert").remove();
      }, 1500);
    }
    asyncFn();
  }
};
const WinningController = () => {
  const winningNumbers = alertError(getWinningNumber);
  const bonusNumber = alertError(() => getBonusNumber(winningNumbers));
  const winningLotto = new WinningLotto(winningNumbers, bonusNumber);
  setState({ winningLotto });
};
const updateUI = () => {
  const state2 = getState();
  const prevState2 = getPrevState();
  if (state2.lottoCount !== prevState2.lottoCount || state2.lottoArray !== prevState2.lottoArray) {
    updatelottoCountUI();
    updateLottoArrayUI();
    updateWinningBonusUI();
    updateResultButtonUI();
  }
  if (state2.matchingCount !== prevState2.matchingCount || state2.profitRate !== prevState2.profitRate) {
    updateResultUI();
  }
};
const updatelottoCountUI = () => {
  const { lottoCount } = getState();
  const countPrompt = `총 ${lottoCount}개를 구매했습니다.`;
  appendElement(".count-prompt", Prompt({ message: countPrompt }));
  disableElement("purchase");
  disableElement("price");
  appendElement(".purchase-container", Prompt({ message: SYSTEM_MESSAGE.CANNOT_RETRY, style: "warning" }));
};
const updateLottoArrayUI = () => {
  const { lottoArray } = getState();
  appendElement(".lotto-numbers-container", LottoNumbers({ lottoArray }));
};
const updateWinningBonusUI = () => {
  const winningPrompt = `지난 주 당첨번호 ${LOTTO_NUMBERS.LENGTH}개와 보너스 번호 ${LOTTO_NUMBERS.BONUS_LENGTH}개를 입력해주세요.
    로또 번호는 1에서 45까지 입력할 수 있습니다.`;
  appendElement(".winning-prompt", Prompt({ message: winningPrompt }));
  appendElement(".winning-bonus-container", WinningInput(), BonusInput());
};
const updateResultButtonUI = () => {
  const resultClickHandler = () => {
    WinningController();
    ResultController();
  };
  const resultButtonProps = { label: "결과 확인하기", onClick: resultClickHandler, style: "large", name: "result" };
  appendElement(".result-button-container", Button(resultButtonProps));
};
const updateResultUI = () => {
  const { matchingCount, profitRate } = getState();
  const modalContent = Result({ matchingCount, profitRate });
  appendElement("#app", Modal({ content: modalContent }));
};
const randomNumberGenerator = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const pickUniqueNumbersInRange = (min, max, count) => {
  const uniqueNumbers = /* @__PURE__ */ new Set();
  while (uniqueNumbers.size < count) {
    uniqueNumbers.add(randomNumberGenerator(min, max));
  }
  return [...uniqueNumbers];
};
const getLottoCount = (price) => {
  return price / LOTTO_PRICE.UNIT;
};
const getLottoArray = (count) => Array.from({ length: count }, () => new Lotto(pickUniqueNumbersInRange(LOTTO_NUMBERS.MIN, LOTTO_NUMBERS.MAX, LOTTO_NUMBERS.LENGTH)));
const PurchaseController = () => {
  const price = alertError(getPrice);
  const lottoCount = getLottoCount(price);
  const lottoArray = getLottoArray(lottoCount);
  setState({ lottoArray, lottoCount });
  updateUI();
  disableElement("purchase");
  disableElement("price");
};
const initializeLottoEvents = async () => {
  addKeyListener("[name=price]", PurchaseController, "Enter");
  document.querySelector("[name=purchase]").addEventListener("click", () => {
    PurchaseController();
  });
};
initializeLottoEvents();
