import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface IProps {
  data: ServerRespond[];
}

interface PerspectiveViewerElement {
  load: (table: Table) => void;
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  componentDidMount() {
    const elem: PerspectiveViewerElement = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      elem.load(this.table);
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.table && this.props.data !== prevProps.data) {
      const uniqueData = this.props.data.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.timestamp === item.timestamp && t.stock === item.stock
        ))
      );

      this.table.update(uniqueData.map((el: ServerRespond) => ({
        stock: el.stock,
        top_ask_price: el.top_ask?.price || 0,
        top_bid_price: el.top_bid?.price || 0,
        timestamp: el.timestamp,
      })));
    }
  }

  render() {
    return React.createElement('perspective-viewer');
  }
}

export default Graph;
