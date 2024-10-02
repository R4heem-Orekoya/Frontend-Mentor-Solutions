import { plans, steps } from "./data.js"

const goBackButton = document.querySelector(".go-back-btn")
const nextStepButton = document.querySelector(".next-step-btn")
const confirmButton = document.querySelector(".confirm-btn")
const dynamicSection = document.querySelector(".dynamic-section")

let currentSlide = 1
let dataCollected = [
   {
      name: "",
      email: "",
      phone: ""
   },
   {
      selected: "arcade",
      billing: "monthly",
   },
   {
      selectedAddOns: [
         {id: 0, name: 'Online service', label: 'Access to multiplayer games', price: 1},
         {id: 1, name: 'Larger storage', label: 'Extra 1TB of cloud save', price: 2}
      ]
   }
]

const initialrender = () => {
   const stepsDiv = document.querySelector('.steps')
   
   steps.forEach((item) => {
      stepsDiv.innerHTML +=`
         <div class="step ${item.index === currentSlide && "active"}">
            <div class="step-number">${item.index}</div>
            <div>
               <p>step ${item.index}</p>
               <span>${item.label}</span>
            </div>
         </div>
      `
   })
   
   goBackButton.classList.add("hide")
   confirmButton.classList.add("hide")
}
initialrender()

const renderForm = () => {
   dynamicSection.innerHTML = `
      <div class="header">
         <h2>Personal Info</h2>
         <p>Please provide your name, email address, and phone number.</p>
      </div>
            
      <form class="personal-info-form">
         <div class="form-input">
            <div>
               <label for="name">
                  Name
               </label>
               <p>This field is required</p>
            </div>
            <input id="name" value="${dataCollected[0].name}" type="text" placeholder="e.g Stephen King">
         </div>
         <div class="form-input">
            <div>
               <label for="email">
                  Email Address
               </label>
               <p>This field is required</p>
            </div>
            <input id="email" value="${dataCollected[0].email}" type="email" placeholder="e.g stephenking@lorem.com">
         </div>
         <div class="form-input">
            <div>
               <label for="phone">
                  Phone Number
               </label>
               <p>This field is required</p>
            </div>
            <input id="phone" value="${dataCollected[0].phone}" type="number" placeholder="e.g +1 234 567 890">
         </div>
      </form>
   `
}

const validateForm = () => {
   const nameInput = document.querySelector("input#name")
   const emailInput = document.querySelector("input#email")
   const phoneInput = document.querySelector("input#phone")
   
   
   /*This is just some simple validation to check if the field are empty
   I might add more validation in the future,but right now i'm done with this project :)
   */
   
   if(nameInput.value !== ""){
      nameInput.parentElement.classList.remove("error")
   }
   if(emailInput.value !== ""){
      emailInput.parentElement.classList.remove("error")
   }
   if(phoneInput.value !== ""){
      phoneInput.parentElement.classList.remove("error")
   }
   
   if(nameInput.value !== "" && emailInput.value !== "" && phoneInput.value !== ""){
      return true
   }
   if(nameInput.value === "" && emailInput.value === "" && phoneInput.value === ""){
      nameInput.parentElement.classList.add("error")
      emailInput.parentElement.classList.add("error")
      phoneInput.parentElement.classList.add("error")
      
      return false
   }
   
   if(nameInput.value === "") {
      nameInput.parentElement.classList.add("error")
      return false
   }
   if(emailInput.value === "") {
      emailInput.parentElement.classList.add("error")
      return false
   }
   if(phoneInput.value === "") {
      phoneInput.parentElement.classList.add("error")
      return false
   }
}

const fillForm = () => {
   const nameInput = document.querySelector("input#name")
   const emailInput = document.querySelector("input#email")
   const phoneInput = document.querySelector("input#phone")
   
   if(nameInput && emailInput && phoneInput) {
      return {
         name: nameInput.value,
         email: emailInput.value,
         phone: phoneInput.value
      }  
   }
}

const renderPlan = () => {
   
   dynamicSection.innerHTML = `
      <div class="header">
         <h2>Select your plan</h2>
         <p>You have the option of monthly or yearly billing.</p>
      </div>
            
      <div class="plans">
         ${plans.reduce((acc, plan) => acc + `
            <div class="plan ${dataCollected[1].selected === plan.label.toLowerCase() ? "active" : ""}" data-label="${plan.label}">
               <img src="${plan.icon}" alt="${plan.label}-icon"/>
               
               <div>
                  <h3>${plan.label}</h3>
                  <p class="price">$${dataCollected[1].billing === "monthly" ? plan.price : (plan.price * (12 - 2))}/${dataCollected[1].billing === "monthly" ? "mo" : "yr"}</p>
                  <p class="free-text ${dataCollected[1].billing === "yearly" ? "active" : ""}">
                     <span>2 months free</span>
                  </p>
               </div>
            </div>
         `, '')}
      </div>
      
      <div class="billing-toggle-section ${dataCollected[1].billing === "yearly" ? "active" : ""}">
         <p>Monthly</p>
         <div class="toggle ${dataCollected[1].billing === "yearly" ? "active" : ""}"></div>
         <p>Yearly</p>
      </div>
   `
   
   const plansEl = document.querySelectorAll(".plan")

   plansEl.forEach((plan) => {
      plan.addEventListener("click", () => {
         //when any of the plan is clicked, we should first remove the active class from any plan element having the active class
         plansEl.forEach((plan) => {
            plan.classList.remove("active")
         })
         
         //add the active class to the plan clicked by the user
         plan.classList.add("active")
         
         //update the dataCollected array with the selected plan
         dataCollected[1].selected = plan.dataset.label.toLowerCase()
      })
   })
   
   const toggle = document.querySelector(".toggle")

   toggle.addEventListener("click", () => {
      const priceEls = document.querySelectorAll(".price")
      
      /*when the billing cycle toggle is clicked, we check if th current billing cycle is monthly or yearly,
      then we should update the dataCollected array with yearly if it was monthly and vice versa
      */
      if(dataCollected[1].billing === "monthly"){
         dataCollected[1].billing = "yearly"
         
         //we should also update the content of the price element
         priceEls.forEach((el, i) => {
            el.textContent = `$${dataCollected[1].billing === "monthly" ? plans[i].price : (plans[i].price * (12 - 2))}/yr` 
         })
         
         //whenever the billing cycle toggle is clicked we should update the price of add ons in the dataCollected array
         dataCollected[2].selectedAddOns.forEach((addOn) => {
            addOn.price = addOn.price * (12 - 2) //2 months free for the yearly plan
         })
      }else{
         dataCollected[1].billing = "monthly"
         
         //we should also update the content of the price element
         priceEls.forEach((el, i) => {
            el.textContent = `$${plans[i].price}/mo` 
         })
         
         //whenever the billing cycle toggle is clicked we should update the price of add ons in the dataCollected array
         dataCollected[2].selectedAddOns.forEach((addOn) => {
            addOn.price = addOn.price / (12 - 2)
         })
      }
      
      //toggle the classList of the toggle button
      toggle.classList.toggle("active")
      
      //some css stuff, on I and God know what i did here now only God knows :)
      document.querySelector(".billing-toggle-section").classList.toggle("active") 
      document.querySelectorAll(".free-text").forEach((text) => {
         text.classList.toggle("active")
      })
   })
}

const renderAddOns = () => {
   const addOns = [
      {
         id: 0,
         name: "Online service",
         label: "Access to multiplayer games",
         price: dataCollected[1].billing === "monthly" ? 1 : (1 * (12 - 2))
      },
      {
         id: 1,
         name: "Larger storage",
         label: "Extra 1TB of cloud save",
         price: dataCollected[1].billing === "monthly" ? 2 : (2 * (12 - 2))
      },
      {
         id: 2,
         name: "Customizable profile",
         label: "Custome theme on your profile",
         price: dataCollected[1].billing === "monthly" ? 2 : (2 * (12 - 2))
      },
   ]
   
   dynamicSection.innerHTML = `
      <div class="header">
         <h2>Pick add-ons</h2>
         <p>Add-ons help enhance your gaming experience.</p>
      </div>
      
      <div class="add-ons">
         ${addOns.reduce((acc, addOn) => acc + `
            <div class="add-on ${dataCollected[2].selectedAddOns.find((item) => item.id === addOn.id)? "selected" : ""}">
               <div class="check">
                  <img src="./assets/images/icon-checkmark.svg" />
               </div>
               <div>
                  <h3>${addOn.name}</h3>
                  <p>${addOn.label}</p>
               </div>
               <p>+$${addOn.price}/${dataCollected[1].billing === "monthly" ? "mo" : "yr"}</p>
            </div>
         `, "")}
      </div>
   `
   
   const addOnsEls = document.querySelectorAll(".add-on")
   
   addOnsEls.forEach((addOn, i) => {
      addOn.addEventListener("click", () => {
         addOn.classList.toggle("selected")
         
         const existingAddOn = dataCollected[2].selectedAddOns.find((item) => item.id === addOns[i].id)
         if(existingAddOn) {
            //remove item from array if it is already in the arry
            
            //method 1
            // const index = dataCollected[2].selectedAddOns.indexOf(addOns[i])
            // dataCollected[2].selectedAddOns.splice(index, 1)
            
            //method 2
            dataCollected[2].selectedAddOns = dataCollected[2].selectedAddOns.filter((item) => {
               return item.id != addOns[i].id
            })
         }else{
            //add item to array if it is not in the array
            dataCollected[2].selectedAddOns.push(addOns[i])
         }
      })
   })
}

const renderFinish = () => {
   const selectedPlan = plans.find((plan) => plan.label.toLowerCase() === dataCollected[1].selected)
   const selectedPlanPrice = dataCollected[1].billing === "monthly" ? selectedPlan.price : (selectedPlan.price * (12 - 2))
   const totalAddOnsPrice = dataCollected[2].selectedAddOns.reduce((acc, addOn) => acc + addOn.price, 0)
   
   dynamicSection.innerHTML = `
      <div class="header">
         <h2>Finishing up</h2>
         <p>Double-check everything looks OK before confirming.</p>
      </div>
      
      <div class="summary">
         <div>
            <div>
               <h3>${dataCollected[1].selected.charAt(0).toUpperCase() + dataCollected[1].selected.slice(1)} <span>(${dataCollected[1].billing})</span></h3>
               <button class="summary-change-btn">change</button>
            </div>
            
            <p>$${selectedPlanPrice}/${dataCollected[1].billing === "monthly" ? "mo" : "yr"}</p>
         </div>
         
         <div class="separator"></div>
         
         ${dataCollected[2].selectedAddOns.reduce((acc, addOn) => acc + `
            <div class="summary-add-on">
               <p>${addOn.name}</p>
               <p>+$${addOn.price}/${dataCollected[1].billing === "monthly" ? "mo" : "yr"}</p>
            </div>
         `, "")}
         
            
      </div>
      
      <div class="summary-total-section">
         <p>Total (${dataCollected[1].billing.charAt(0).toUpperCase() + dataCollected[1].billing.slice(1)})</p>
         <p class="summary-total">+$${totalAddOnsPrice + selectedPlanPrice}/${dataCollected[1].billing === "monthly" ? "mo" : "yr"}</p>
      </div>
   `
   
   const changeButton = document.querySelector(".summary-change-btn")
   
   //jump to the plans slide when this button is clicked
   changeButton.addEventListener("click", () => {
      currentSlide = 2
      removeActiveFromAllStepButtons()
      stepButtons[currentSlide - 1].classList.add("active")
      hashMap[currentSlide]()
      
      //hide the confirm button
      confirmButton.classList.add("hide")
      //show the next step button
      nextStepButton.classList.remove("hide")
   })
}

const renderThnakYou = () => {
   dynamicSection.innerHTML =  `
      <div class="thank-you">
         <img src="../assets/images/icon-thank-you.svg" alt="thank you icon"/>
         <h2>Thank you!</h2>
         <p>
            Thanks for confirming your subscription! 
            We hope you have fun using our platform. 
            If you ever need support, please feel 
            free to email us at support@loremgaming.com 
         </p>
      </div>
   `
}

const hashMap = {
   1: renderForm,
   2: renderPlan,
   3: renderAddOns,
   4: renderFinish,
   5: renderThnakYou
}
hashMap[currentSlide]()

const stepButtons = document.querySelectorAll(".step")
const removeActiveFromAllStepButtons = () => {
   stepButtons.forEach((step) => {
      step.classList.remove("active")
   })
}

nextStepButton.addEventListener("click", () => {
   //if for any reason we are on the last slide and the next step button is still showing we should return
   if(currentSlide === stepButtons.length) return
   
   if(currentSlide === 1 && !validateForm()) return
   
   //we should show the go back button as soon as the next step button is clicked to enable user navigate back
   if(goBackButton.classList.contains("hide")) {
      goBackButton.classList.remove("hide")
   }
   
   if(currentSlide === 1) {
      const formData = fillForm()
      dataCollected[0].name = formData.name
      dataCollected[0].email = formData.email
      dataCollected[0].phone = formData.phone.toString()
   }
   console.log(dataCollected);
   
   //increment the currentSlide by 1
   currentSlide = currentSlide + 1
   //remove the active class from any step button having the active class
   removeActiveFromAllStepButtons()
   //add the active class to the step button whose index is corresponding with the currentSlide
   stepButtons[currentSlide - 1].classList.add("active")
   //display a slide based on the currentSlide
   hashMap[currentSlide]()
   
   //if we are on the last slide we should hide the next step button and show the confirm button
   if(currentSlide === stepButtons.length){
      nextStepButton.classList.add("hide")
      confirmButton.classList.remove("hide")
   }
})

goBackButton.addEventListener("click", () => {
   //decrement currentSlide by 1
   currentSlide = currentSlide - 1
   
   //if the confirm button is not hidden we should hide it and show the next step button
   if(!confirmButton.classList.contains("hide")){
      nextStepButton.classList.remove("hide")
      confirmButton.classList.add("hide")
   }
   
   //remove the active class from any step button having the active class
   removeActiveFromAllStepButtons()
   //add the active class to the step button whose index is corresponding with the currentSlide
   stepButtons[currentSlide - 1].classList.add("active")
   //display a slide based on the currentSlide
   hashMap[currentSlide]()
   
   //we should hide the go back button on the first slide
   if(currentSlide === 1) {
      goBackButton.classList.add("hide")
   }
})

confirmButton.addEventListener("click", () => {
   //display the thank you slide
   hashMap[5]()
   
   //hide both the confirm button and go back button
   confirmButton.classList.add("hide")
   goBackButton.classList.add("hide")
})