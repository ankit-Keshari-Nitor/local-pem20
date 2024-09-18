


Step Definition Strategy

* Use third person view
  * Use User instead of I
* Steps can be both declarative as well as imperative
* Steps definition should follow Noun-Verb-Noun syntax
* Prefix enum type params using []
* Steps should paramterized generic steps

Standardized locators

* Use Css classname/tag/name/id
* 

Timeouts : 

* To increase timeout for a particular step use Given/When/Then('`<description>`', { timout: `<newTimeoutValue>`}, async function() {})
* To wait for UI to do some api processing before next step use step : User waits for api call for {int}
