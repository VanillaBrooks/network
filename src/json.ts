export interface GraphJson {
	nodes: Array<Node>,
	edges: Array<Edge>,
}

export interface Node {
	parent_file_name: string,
	self_subroutine_name: string,
	cycles: number
}

export interface Edge {
    self_subroutine_name: string,
    called_subroutine_name: string,
    occurances: number,
}

