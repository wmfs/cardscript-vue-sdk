module.exports = function getDefaultInternals (cardscript) {
  const internals = {
    dialogControl: {},
    currentCardListData: {},
    cardListParents: {}
  }

  const cardListPath = []

  cardscript.body.forEach(parseElement)

  function parseElement (element) {
    switch (element.type) {
      case 'CardList':
        internals.dialogControl[element.id] = false
        internals.currentCardListData[element.id] = {}
        if (cardListPath.length === 0) {
          internals.cardListParents[element.id] = null
          cardListPath.push(element.id)
        } else {
          internals.cardListParents[element.id] = cardListPath[cardListPath.length - 1]
          cardListPath.push(element.id)
        }
        element.card.body.forEach(parseElement)
        cardListPath.pop()
        break
      case 'ColumnSet':
        element.columns.forEach(parseElement)
        break
      case 'FactSet':
        if (Array.isArray(element.facts)) {
          element.facts.forEach(parseElement)
        }
        break
      case 'Collapsible':
        element.card.body.forEach(parseElement)
        break
      case 'TabSet':
        element.tabs.forEach(parseElement)
        break
      case 'Stepper':
        element.steps.forEach(parseElement)
        break
      case 'Tab':
      case 'Step':
      case 'Column':
      case 'Container':
        element.items.forEach(parseElement)
    }
  }

  return internals
}
