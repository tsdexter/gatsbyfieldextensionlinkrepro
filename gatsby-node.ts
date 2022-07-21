import { GatsbyNode } from "gatsby"

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  // Data can come from anywhere, but for now create it manually
  const courses = [{
    key: 1,
    code: "ACCT",
    number: 1000
  },{
    key: 2,
    code: `ACCT`,
    number: 1001
  },{
    key: 3,
    code: `ACCT`,
    number: `1002`
  }]

  const programs = [{
    key: 1,
    name: "Accounting",
    requirements: [{
      code: 'ACCT',
      number: 1000
    }, {
      code: 'ACCT',
      number: 1001
    }]
  }]


  courses.forEach(data => {
    const nodeContent = JSON.stringify(data)
  
    const nodeMeta = {
      id: createNodeId(`Course-${data.key}`),
      parent: null,
      children: [],
      internal: {
        type: `Course`,
        mediaType: `text/html`,
        content: nodeContent,
        contentDigest: createContentDigest(data)
      }
    }
  
    const node = Object.assign({}, data, nodeMeta)
    createNode(node)
  })

  programs.forEach(data => {
    const nodeContent = JSON.stringify(data)
  
    const nodeMeta = {
      id: createNodeId(`Program-${data.key}`),
      parent: null,
      children: [],
      internal: {
        type: `Program`,
        mediaType: `text/html`,
        content: nodeContent,
        contentDigest: createContentDigest(data)
      }
    }
  
    const node = Object.assign({}, data, nodeMeta)
    createNode(node)
  })

}

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  async ({ actions }) => {
    const { createTypes, createFieldExtension } = actions
    createFieldExtension({
      name: `courseCode`,
      extend() {
        return {
          resolve(source): string {
            return `${source.code} ${source.number}`
          },
        }
      },
    })
    createTypes(`
      type Course implements Node {
        code: String
        number: Int
        courseCode: String @courseCode
      }
      type ProgramRequirements {
        code: String
        number: Int
        courseCode: String @courseCode
        course: Course @link(from: "courseCode", by: "courseCode")
      }
  `)
  }