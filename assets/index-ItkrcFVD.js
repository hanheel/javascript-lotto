var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _numbers, _winningNumbers, _bonusNumber, _lottoNumbersList, _LottoResult_instances, isBonusMatched_fn, calculateMatchCount_fn, _bonusNumber2, _WinningLotto_instances, isRangeValid_fn, isDistinct_fn;
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
let originalApp;
const setOriginalApp = (app) => {
  originalApp = app.cloneNode(true);
};
const getOriginalApp = () => originalApp;
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
const disabledButton = (name) => {
  const button = document.querySelector(`[name=${name}]`);
  button.disabled = true;
};
const LOTTO_NUMBERS = {
  LENGTH: 6,
  BONUS_LENGTH: 1,
  MIN: 1,
  MAX: 45
};
const LOTTO_PRICE = 1e3;
const LOTTO_PRIZE = {
  3: 5e3,
  4: 5e4,
  5: 15e5,
  6: 2e9,
  bonus: 3e7
};
const formatNumber = (number) => {
  return number.toLocaleString();
};
const SYSTEM_MESSAGE = {
  PRICE: "구입 금액을 입력해 주세요.",
  COUNT: (count) => `${count}개를 구매했습니다.`,
  WINNING_NUMBER: "당첨 번호를 입력해 주세요.",
  BONUS_NUMBER: "보너스 번호를 입력해 주세요.",
  RETRY: "다시 시작하시겠습니까? (y/n)",
  WINNING_STATISTICS: (matchingCount) => `당첨 통계
--------------------
  3개 일치(${formatNumber(LOTTO_PRIZE[3])}) - ${matchingCount[3]}개
  4개 일치(${formatNumber(LOTTO_PRIZE[4])}) - ${matchingCount[4]}개
  5개 일치(${formatNumber(LOTTO_PRIZE[5])}) - ${matchingCount[5]}개
  5개 일치, 보너스 볼 일치(${formatNumber(LOTTO_PRIZE["bonus"])}) - ${matchingCount["bonus"]}개
  6개 일치(${formatNumber(LOTTO_PRIZE[6])}) - ${matchingCount[6]}개`,
  MATCH_COUNT: (count, prize) => `${count}개 일치 (${formatNumber(prize)}원) - ${count}개`,
  MATCH_BONUS_COUNT: (count, prize) => `5개 일치, 보너스 볼 일치 (${formatNumber(prize)}원) - ${count}개`,
  PROFIT: (profit) => `총 수익률을 ${profit}% 입니다.`,
  CANNOT_RETRY: "결과를 확인한 후 재구매할 수 있습니다."
};
const runValidators = (validators, input) => validators.forEach((validate) => validate(input));
const validationCondition = {
  isNumber(input) {
    return !isNaN(input);
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
  UNDER_PRICE: `${LOTTO_PRICE}원보다 큰 수를 입력해주세요`,
  INDIVISIBLE: `구입 금액은 ${LOTTO_PRICE}원 단위여야 합니다.`
};
const checkEmptyInput$1 = (priceInput) => {
  if (validationCondition.isEmpty(priceInput)) {
    throw new Error(PRICE_ERROR_MESSAGE.EMPTY);
  }
};
const checkIsNumber$2 = (priceInput) => {
  if (!validationCondition.isNumber(priceInput)) {
    throw new Error(PRICE_ERROR_MESSAGE.NUMBER);
  }
};
const checkUnderPrice = (priceInput) => {
  if (validationCondition.isUnder(priceInput, LOTTO_PRICE)) {
    throw new Error(PRICE_ERROR_MESSAGE.UNDER_PRICE);
  }
};
const checkDivisiblePrice = (priceInput) => {
  if (!validationCondition.isDivisible(priceInput, LOTTO_PRICE)) {
    throw new Error(PRICE_ERROR_MESSAGE.INDIVISIBLE);
  }
};
const validatePrice = (priceInput) => runValidators([checkEmptyInput$1, checkIsNumber$2, checkUnderPrice, checkDivisiblePrice], priceInput);
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
const checkIsNumber$1 = (winningNumberInput) => {
  if (winningNumberInput.some((number) => !validationCondition.isNumber(number))) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.NUMBER);
  }
};
const checkLengthValid = (winningNumberInput) => {
  if (!validationCondition.isLengthValid(winningNumberInput, LOTTO_NUMBERS.LENGTH)) {
    throw new Error(LOTTO_NUMBERS_ERROR_MESSAGE.LENGTH);
  }
};
const checkRange$1 = (winningNumberInput) => {
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
  return runValidators([checkEmptyInput, checkEmptyItem, checkIsNumber$1, checkLengthValid, checkRange$1, checkIsDistinct], winningNumbers);
};
const checkIsEmpty = (bonusNumberInput) => {
  if (validationCondition.isEmpty(bonusNumberInput)) {
    throw new Error(BONUS_NUMBER_ERROR_MESSAGE.EMPTY);
  }
};
const checkIsNumber = (bonusNumberInput) => {
  if (!validationCondition.isNumber(bonusNumberInput)) {
    throw new Error(BONUS_NUMBER_ERROR_MESSAGE.NUMBER);
  }
};
const checkRange = (bonusNumberInput) => {
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
  runValidators([checkIsEmpty, checkIsNumber, checkRange, (bonusNumberInput2) => checkDuplicate(winningNumbers, bonusNumberInput2)], bonusNumberInput);
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
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/javascript-lotto/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const isWebEnvironMent$1 = typeof window !== "undefined";
const InputView = {
  async readUserInput(message, inputType, isMultiple = false) {
    if (isWebEnvironMent$1 && isMultiple) {
      return this.readWebInputs(inputType);
    }
    if (isWebEnvironMent$1 && !isMultiple) {
      return this.readWebInput(inputType);
    }
    const { readLineAsync } = await __vitePreload(async () => {
      const { readLineAsync: readLineAsync2 } = await import("./readLineAsync-BO0fboh1.js");
      return { readLineAsync: readLineAsync2 };
    }, true ? [] : void 0);
    return await readLineAsync(message);
  },
  readWebInput(name) {
    const inputElement = document.querySelector(`[name=${name}]`);
    return inputElement.value;
  },
  readWebInputs(name) {
    const inputs = document.querySelectorAll(`[name=${name}]`);
    return Array.from(inputs).map((input) => input.value).join(", ");
  }
};
const getPrice = async () => {
  const priceInput = await InputView.readUserInput(SYSTEM_MESSAGE.PRICE, "price");
  validatePrice(priceInput);
  return parsePrice(priceInput);
};
const getWinningNumber = async () => {
  const isMultipleValue = true;
  const winningNumberInput = await InputView.readUserInput(SYSTEM_MESSAGE.WINNING_NUMBER, "winning-number", isMultipleValue);
  validateWinningNumber(winningNumberInput);
  return parseWinningNumbers(winningNumberInput);
};
const getBonusNumber = async (winningNumbers) => {
  const bonusNumberInput = await InputView.readUserInput(SYSTEM_MESSAGE.BONUS_NUMBER, "bonus-number");
  validateBonusNumber(winningNumbers, bonusNumberInput);
  return parseBonusNumber(bonusNumberInput);
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
  return price / LOTTO_PRICE;
};
const getLottoArray = (count) => Array.from({ length: count }, () => new Lotto(pickUniqueNumbersInRange(LOTTO_NUMBERS.MIN, LOTTO_NUMBERS.MAX, LOTTO_NUMBERS.LENGTH)));
const Alert = ({ message }) => {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.classList.add("font-body");
  alert.textContent = message;
  return alert;
};
const displayComponent = (parentElement, ...childElement) => {
  childElement.forEach((element) => document.querySelector(`${parentElement}`).appendChild(element));
};
const retryOnErrorForTerminal = async (asyncFn, onError) => {
  while (true) {
    try {
      return await asyncFn();
    } catch (e) {
      onError(e);
    }
  }
};
const retryOnErrorWeb = async (asyncFn) => {
  try {
    return await asyncFn();
  } catch (error) {
    const alert = document.querySelector(".alert");
    if (!alert) {
      displayComponent(".alert-container", Alert({ message: error.message }));
      setTimeout(() => {
        document.querySelector(".alert").remove();
      }, 1500);
    }
    await asyncFn();
  }
};
const isWebEnvironMent = typeof window !== "undefined";
const retryOnError = async (func, onError) => {
  if (isWebEnvironMent) {
    return await retryOnErrorWeb(func);
  }
  return await retryOnErrorForTerminal(func, onError);
};
const OutputView = {
  print(message) {
    console.log(message);
  },
  printError(error) {
    console.error(error.message);
  },
  printLottoArray(lottoArray) {
    lottoArray.forEach((lotto) => OutputView.print(lotto.numbers));
  },
  printMatchingCount(matchingCount) {
    OutputView.print(SYSTEM_MESSAGE.WINNING_STATISTICS(matchingCount));
  }
};
const PurchaseController = async () => {
  const price = await retryOnError(getPrice, OutputView.printError);
  const lottoCount = getLottoCount(price);
  OutputView.print(SYSTEM_MESSAGE.COUNT(lottoCount));
  const lottoArray = getLottoArray(lottoCount);
  OutputView.printLottoArray(lottoArray);
  return { lottoArray, lottoCount };
};
const LottoNumberInput = ({ name, style = "small", placeholder = "" }) => {
  const lottoNumberInput = document.createElement("input");
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
const setInputCss = (style) => {
  if (style === "large") {
    return "large-input";
  }
  if (style === "small") {
    return "small-input";
  }
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
  lottoImage.src = "/lotto.png";
  lottoImage.alt = "로또 이미지";
  lottoNumbersItem.appendChild(lottoImage);
  lottoNumbersItem.appendChild(lottoItem);
  return lottoNumbersItem;
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
const setButtonCss = (style) => {
  if (style === "large") {
    return "large-button";
  }
  if (style === "small") {
    return "small-button";
  }
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
  modalBackground.addKeyList;
  return modalBackground;
};
const ModalLayout = ({ content }) => {
  const modalContents = document.createElement("div");
  modalContents.classList.add("modal");
  modalContents.appendChild(content);
  return modalContents;
};
const retryHandler = () => {
  const originalApp2 = getOriginalApp();
  const currentApp = document.querySelector("#app");
  if (originalApp2) {
    currentApp.replaceChildren(...originalApp2.children);
  }
  runLotto();
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
  resultContainer.appendChild(Button({ label: "다시 시작하기", style: "large", name: "retry", onClick: retryHandler }));
  return resultContainer;
};
const ExitIcon = () => {
  const exitIconContainer = document.createElement("div");
  exitIconContainer.classList.add("exit-icon-container");
  const exitIcon = document.createElement("img");
  exitIcon.src = "/close.png";
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
const ResultController = (winningLotto, lottoArray) => {
  const lottoResult = new LottoResult(winningLotto, lottoArray);
  const matchingCount = lottoResult.calculateResult();
  return matchingCount;
};
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
const WinningController = async () => {
  const winningNumbers = await retryOnError(getWinningNumber, OutputView.printError);
  const bonusNumber = await retryOnError(() => getBonusNumber(winningNumbers), OutputView.printError);
  const winningLotto = new WinningLotto(winningNumbers, bonusNumber);
  return winningLotto;
};
const calculateWinningAmount = (matchingCount) => {
  return Object.keys(matchingCount).reduce((sum, count) => sum + matchingCount[count] * (LOTTO_PRIZE[count] || 0), 0);
};
const calculateProfitRate = (matchingCount, lottoCount) => {
  const winningAmount = calculateWinningAmount(matchingCount);
  const profitRatio = winningAmount / (lottoCount * LOTTO_PRICE);
  return (profitRatio * 100).toFixed(1);
};
const resultHandler = async (lottoCount, lottoArray) => {
  const winningLotto = await WinningController();
  const matchingCount = ResultController(winningLotto, lottoArray);
  const profitRate = calculateProfitRate(matchingCount, lottoCount);
  WebOutputView.renderResult(matchingCount, profitRate);
};
const WebOutputView = {
  renderLottoFlow(lottoCount, lottoArray) {
    displayComponent(".purchase-container", Prompt({ message: SYSTEM_MESSAGE.CANNOT_RETRY, style: "warning" }));
    const countPrompt = `총 ${lottoCount}개를 구매했습니다.`;
    displayComponent(".count-prompt", Prompt({ message: countPrompt }));
    displayComponent(".lotto-numbers-container", LottoNumbers({ lottoArray }));
    const winningPrompt = `지난 주 당첨번호 ${LOTTO_NUMBERS.LENGTH}개와 보너스 번호 ${LOTTO_NUMBERS.BONUS_LENGTH}개를 입력해주세요.
  로또 번호는 1에서 45까지 입력할 수 있습니다.`;
    displayComponent(".winning-prompt", Prompt({ message: winningPrompt }));
    displayComponent(".winning-bonus-container", WinningInput(), BonusInput());
    const resultButtonProps = { label: "결과 확인하기", onClick: () => showResult(lottoCount, lottoArray), style: "large", name: "result" };
    displayComponent(".result-button-container", Button(resultButtonProps));
    addKeyListener(
      "[name=winning-number], [name=bonus-number]",
      () => {
        resultHandler(lottoCount, lottoArray);
      },
      "Enter"
    );
  },
  renderResult(matchingCount, profitRate) {
    const modalContent = Result({ matchingCount, profitRate });
    displayComponent("#app", Modal({ content: modalContent }));
  }
};
const purchaseLotto = async () => {
  const { lottoArray, lottoCount } = await PurchaseController();
  WebOutputView.renderLottoFlow(lottoCount, lottoArray);
  disabledButton("purchase");
};
const initialHandler = () => {
  const originalApp2 = document.querySelector("#app");
  setOriginalApp(originalApp2);
  addKeyListener("[name=price]", purchaseLotto, "Enter");
  document.querySelector("[name=purchase]").addEventListener("click", () => {
    purchaseLotto();
  });
};
initialHandler();
